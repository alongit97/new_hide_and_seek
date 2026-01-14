from os import environ

from otree.project_template.settings import SESSION_CONFIG_DEFAULTS

SESSION_CONFIG_DEFAULTS = dict(
    real_world_currency_per_point=2, participation_fee=1, doc="", currency="GBP", DEBUG=True
)
SESSION_CONFIGS = [
    {
        'name': "hider_3_boxes_1_opens",
        'display_name': "hider, 3 boxes, 1 opens",
        'num_demo_participants': 24,
        'app_sequence': ["hider", "consent", "intro", "test", "board_intro", "board", "feedback", "exit"],

        'multipliers': [
            [1, 1, 1],
            [1, 1, 3],
            [3, 3, 1],
            [1, 2, 3],
        ],
        'starting_money': [72, 56, 40, 44],
        'boxes_to_open': [1, 1, 1, 1],
    },

    {
        'name': "hider_3_boxes_2_opens",
        'display_name': "hider, 3 boxes, 2 opens",
        'num_demo_participants': 24,
        'app_sequence': ["hider", "consent", "intro", "test", "board_intro", "board", "feedback", "exit"],

        'multipliers': [
            [1, 1, 1],
            [1, 1, 3],
            [3, 3, 1],
            [1, 2, 3],
        ],
        'starting_money': [72, 56, 40, 44],
        'boxes_to_open': [2, 2, 2, 2],
    },

    {
        'name': "hider_4_boxes_2_opens",
        'display_name': "hider, 4 boxes, 2 opens",
        'num_demo_participants': 24,
        'app_sequence': ["hider", "consent", "intro", "test", "board_intro", "board", "feedback", "exit"],

        'multipliers': [
            [1, 1, 1, 1],
            [1, 1, 1, 3],
            [3, 3, 3, 1],
            [1, 2, 3, 4],
        ],
        'starting_money': [96, 80, 48, 50],
        'boxes_to_open': [2, 2, 2, 2],
    },

    {
        'name': "hider_5_boxes_2_opens",
        'display_name': "hider, 5 boxes, 2 opens",
        'num_demo_participants': 24,
        'app_sequence': ["hider", "consent", "intro", "test", "board_intro", "board", "feedback", "exit"],

        'multipliers': [
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 3],
            [3, 3, 3, 3, 1],
            [1, 2, 3, 4, 6],
        ],
        'starting_money': [120, 104, 56, 54],
        'boxes_to_open': [2, 2, 2, 2],
    },

    {
        'name': "hider_5_boxes_3_opens",
        'display_name': "hider, 5 boxes, 3 opens",
        'num_demo_participants': 24,
        'app_sequence': ["hider", "consent", "intro", "test", "board_intro", "board", "feedback", "exit"],

        'multipliers': [
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 3],
            [3, 3, 3, 3, 1],
            [1, 2, 3, 4, 6],
        ],
        'starting_money': [120, 104, 56, 54],
        'boxes_to_open': [3, 3, 3, 3],
    },

    {
        'name': "seeker_3_boxes_1_open",
        'display_name': "seeker, 3 boxes, 1 opens",
        'num_demo_participants': 24,
        'app_sequence': ["seeker", "consent", "intro", "test", "board_intro", "board", "feedback", "exit"],

        'multipliers': [
            [1, 1, 1],
            [1, 1, 3],
            [1, 3, 3],
            [1, 2, 3],
        ],
        'starting_money': [72, 56, 40, 44],
        'boxes_to_open': [1, 1, 1, 1],
    },

    {
        'name': "seeker_3_boxes_2_open",
        'display_name': "seeker, 3 boxes, 2 opens",
        'num_demo_participants': 24,
        'app_sequence': ["seeker", "consent", "intro", "test", "board_intro", "board", "feedback", "exit"],

        'multipliers': [
            [1, 1, 1],
            [1, 1, 3],
            [1, 3, 3],
            [1, 2, 3],
        ],
        'starting_money': [72, 56, 40, 44],
        'boxes_to_open': [2, 2, 2, 2],
    },

    {
        'name': "seeker_4_boxes_2_open",
        'display_name': "seeker, 4 boxes, 2 opens",
        'num_demo_participants': 24,
        'app_sequence': ["seeker", "consent", "intro", "test", "board_intro", "board", "feedback", "exit"],

        'multipliers': [
            [1, 1, 1, 1],
            [1, 1, 1, 3],
            [3, 3, 3, 1],
            [1, 2, 3, 4],
        ],
        'starting_money': [96, 80, 48, 50],
        'boxes_to_open': [2, 2, 2, 2],
    },

    {
        'name': "seeker_5_boxes_2_open",
        'display_name': "seeker, 5 boxes, 2 opens",
        'num_demo_participants': 24,
        'app_sequence': ["seeker", "consent", "intro", "test", "board_intro", "board", "feedback", "exit"],

        'multipliers': [
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 3],
            [3, 3, 3, 3, 1],
            [1, 2, 3, 4, 6],
        ],
        'starting_money': [120, 104, 56, 54],
        'boxes_to_open': [2, 2, 2, 2],
    },

    {
        'name': "seeker_5_boxes_3_open",
        'display_name': "seeker, 5 boxes, 3 opens",
        'num_demo_participants': 24,
        'app_sequence': ["seeker", "consent", "intro", "test", "board_intro", "board", "feedback", "exit"],

        'multipliers': [
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 3],
            [3, 3, 3, 3, 1],
            [1, 2, 3, 4, 6],
        ],
        'starting_money': [120, 104, 56, 54],
        'boxes_to_open': [3, 3, 3, 3],
    },

    {
        'name': "treatment_allocator",
        'display_name': "treatment_allocator",
        'num_demo_participants': 24,
        'app_sequence': ["treatment_allocator"],
    }
]
ROOMS = [
    {"name": "hider", "display_name": "hider"},
    {"name": "seeker", "display_name": "seeker"},
    {"name":"treatment_allocator","display_name": "treatment_allocator"}
]

# if you set a property in SESSION_CONFIG_DEFAULTS, it will be inherited by all configs
# in SESSION_CONFIGS, except those that explicitly override it.
# the session config can be accessed from methods in your apps as self.session.config,
# e.g. self.session.config['participation_fee']


PARTICIPANT_FIELDS = [
    "user_accepted_terms",
    "ended_successfully",
    "role",
    "num_boxes",
]
SESSION_FIELDS = []

# ISO-639 code
# for example: de, fr, ja, ko, zh-hans
LANGUAGE_CODE = 'en'

# e.g. EUR, GBP, CNY, JPY
USE_POINTS = False

ADMIN_USERNAME = 'admin'
# for security, best to set admin password in an environment variable
ADMIN_PASSWORD = "semd-admin"

DEMO_PAGE_INTRO_HTML = """ """

SECRET_KEY = '6162084313426'