from otree.api import *
from datetime import datetime, timezone
import json
import itertools
from .matrices import MATRICES
from .matrices import MATRICES, STARTING_MONEY


# ======================================================
# Constants
# ======================================================
class C(BaseConstants):
    NAME_IN_URL = 'board'
    PLAYERS_PER_GROUP = None
    NUM_ROUNDS = 4  # number of rounds per game

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
ALL_ORDERS = list(range(C.NUM_ROUNDS))  # 0..3

class Subsession(BaseSubsession):
    def creating_session(self):
        config = self.session.config
        if 'num_boxes' not in config:
            raise ValueError("Session config must have 'num_boxes' (3,4,5)")
        if config['num_boxes'] not in [3, 4, 5]:
            raise ValueError("'num_boxes' must be 3, 4, or 5")

class Group(BaseGroup):
    pass

# ======================================================
# Pages
# ======================================================
class PreProcess(Page):
    @staticmethod
    def before_next_page(player: Player, timeout_happened):
        config = player.session.config
        num_boxes = config['num_boxes']

        pid = player.id_in_subsession
        participant_index = (pid - 1) % 24

        round_idx = player.round_number - 1
        multipliers = MATRICES[num_boxes][participant_index][round_idx]

        total_money = STARTING_MONEY[num_boxes][participant_index][round_idx]

        n = len(multipliers)

        boxes_to_open = num_boxes - 2 if num_boxes > 3 else 1

        player.multipliers_json = json.dumps(multipliers)
        player.distribution_json = json.dumps([0] * n)
        player.selection_json = json.dumps([False] * n)

        player.total_number_of_objects = total_money
        player.boxes_to_open = boxes_to_open
        player.start_time = str(datetime.now(timezone.utc))

        print(
            f"Player {pid} | Round {player.round_number} "
            f"| ParticipantIndex {participant_index} "
            f"| RoundIndex {round_idx} "
            f"| multipliers {multipliers} "
            f"| total {total_money}"
        )



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

        if player.participant.role == "hider":
            distribution = json.loads(player.distribution_json)
            if action == "set_number_of_objects":
                idx = data["box_index"]
                val = int(data["number_of_objects"])
                if 0 <= idx < len(distribution):
                    distribution[idx] = val
                    if sum(distribution) <= player.total_number_of_objects:
                        player.distribution_json = json.dumps(distribution)
            elif action == "finish_round":
                if sum(distribution) == player.total_number_of_objects:
                    return {player.id_in_group: {"action": "finish_round", "finished": True}}

        elif player.participant.role == "seeker":
            selection = json.loads(player.selection_json)
            if action == "set_selection":
                selection = data["selection"]
                player.selection_json = json.dumps(selection)
            elif action == "finish_round":
                if sum(selection) == player.boxes_to_open:
                    return {player.id_in_group: {"action": "finish_round", "finished": True}}

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
