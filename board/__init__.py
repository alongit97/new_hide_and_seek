from otree.api import *
from datetime import datetime, timezone
import json
import itertools

# ======================================================
# Constants
# ======================================================

class C(BaseConstants):
    NAME_IN_URL = 'board'
    PLAYERS_PER_GROUP = None
    NUM_ROUNDS = 4


# ======================================================
# Player
# ======================================================

class Player(BasePlayer):
    start_time = models.StringField(blank=True)
    end_time = models.StringField(blank=True)

    multipliers_json = models.LongStringField()
    distribution_json = models.LongStringField()
    selection_json = models.LongStringField()

    total_number_of_objects = models.IntegerField()
    finished = models.BooleanField(initial=False)
    
    boxes_to_open = models.IntegerField()


# ======================================================
# Subsession / Group
# ======================================================

# Precompute all permutations of 4 rounds (4! = 24)
ALL_ORDERS = list(itertools.permutations(range(C.NUM_ROUNDS)))

class Subsession(BaseSubsession):
    def creating_session(self):
        config = self.session.config

        # Sanity checks
        for key in ['multipliers', 'starting_money', 'boxes_to_open']:
            if key not in config:
                raise ValueError(f"Missing session config key: {key}")
            if len(config[key]) != C.NUM_ROUNDS:
                raise ValueError(f"{key} must have length {C.NUM_ROUNDS}")


class Group(BaseGroup):
    pass


# ======================================================
# Pages
# ======================================================

class PreProcess(Page):
    @staticmethod
    def before_next_page(player: Player, timeout_happened):
        config = player.session.config

        # Use player.id_in_subsession to pick a permutation of rounds
        pid = player.id_in_subsession  # 1..N
        order = ALL_ORDERS[(pid - 1) % len(ALL_ORDERS)]

        # Determine which row to show for this round
        round_idx = order[player.round_number - 1]

        multipliers = config['multipliers'][round_idx]
        total_money = config['starting_money'][round_idx]
        boxes_to_open = config['boxes_to_open'][round_idx]

        n = len(multipliers)

        # Store JSONs and totals in player
        player.multipliers_json = json.dumps(multipliers)
        player.distribution_json = json.dumps([0] * n)
        player.selection_json = json.dumps([False] * n)

        player.total_number_of_objects = total_money
        player.boxes_to_open = boxes_to_open
        player.start_time = str(datetime.now(timezone.utc))

        # DEBUG
        print(f"Player {pid} | Round {player.round_number} -> config row {round_idx}")


class Board(Page):
    form_model = 'player'
    form_fields = ['finished']

    @staticmethod
    def js_vars(player: Player):
        return {
            "multipliers": json.loads(player.multipliers_json),
            "distribution": json.loads(player.distribution_json),
            "selection": json.loads(player.selection_json),
            "totalNumberOfObjects": player.total_number_of_objects,
            "roundNumber": player.round_number,
            "role": player.participant.role,
            "boxesToOpen": player.boxes_to_open,
        }

    @staticmethod
    def live_method(player: Player, data):
        action = data.get("action")

        # ----------------------------
        # HIDER
        # ----------------------------
        if player.participant.role == "hider":
            distribution = json.loads(player.distribution_json)

            if action == "set_number_of_objects":
                idx = data["box_index"]
                val = int(data["number_of_objects"])

                if idx < 0 or idx >= len(distribution):
                    return

                distribution[idx] = val

                if sum(distribution) <= player.total_number_of_objects:
                    player.distribution_json = json.dumps(distribution)

            elif action == "finish_round":
                if sum(distribution) == player.total_number_of_objects:
                    return {
                        player.id_in_group: {
                            "action": "finish_round",
                            "finished": True
                        }
                    }

        # ----------------------------
        # SEEKER
        # ----------------------------
        elif player.participant.role == "seeker":
            selection = json.loads(player.selection_json)

            if action == "set_selection":
                selection = data["selection"]
                player.selection_json = json.dumps(selection)

            elif action == "finish_round":
                if sum(selection) == player.boxes_to_open:
                    return {
                        player.id_in_group: {
                            "action": "finish_round",
                            "finished": True
                        }
                    }

    @staticmethod
    def before_next_page(player: Player, timeout_happened):
        player.end_time = str(datetime.now(timezone.utc))
        player.participant.ended_successfully = True


# ======================================================
# Page sequence
# ======================================================

page_sequence = [
    PreProcess,
    Board,
]
