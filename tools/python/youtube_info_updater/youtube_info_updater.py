#! /usr/bin/env python3
from dotenv import dotenv_values
import json
import logging
from logging.handlers import RotatingFileHandler
import mysql.connector
from pathlib import Path
import requests

# constants
DEBUG = False
LOG_NAME = 'updater.log'


class YoutubeInfoUpdater():
    """
    The YoutubeInfoUpdater allows a user to get the most up to date youtube video
    ids and save them to a database.
    """
    def __init__(self, env_file_path=None):
        self.__env_file_path = env_file_path

        # set the env_file_path to the default if none is given.
        if self.__env_file_path is None:
            env_path = Path(__file__).absolute().parent.parent.parent.parent
            self.__env_file_path = env_path.joinpath('.env.local').absolute()

        # private league dictionary
        self.__leagues = dict()

        # private database variables
        self.__mysql_connection = None
        self.__mysql_host = None
        self.__mysql_database = None
        self.__mysql_user = None
        self.__mysql_password = None

        # private api variables
        self.__youtube_api_key = None
        self.__shl_channel_id = None
        self.__smjhl_channel_id = None
        self.__wjc_channel_id = None
        self.__iihf_channel_id = None
        self.__google_api_url = 'https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&order=date&maxResults=1'

        # logging
        self.__logger = None
        
        self.create_logger(LOG_NAME)
        self.set_database_information()
        self.set_api_url()
        self.set_leagues()

# API functions

    def get_video_info(self, league: str):
        """
        Gets the video ID for the specified league.
        """
        self.__logger.debug(f'get_video_info executing, args [{league}]')

        league_id = self.__leagues[league.lower()]
        response = requests.get(f'{self.__google_api_url}&channelId={league_id}',
            headers={"referer":"index.simulationhockey.com"})
        response_payload = response.json()

        if response.status_code == 403 and 'quota' in response_payload['error']['message']:
            self.__logger.critical(f'Quota error: {json.dumps(response_payload, indent=2)}')
            raise Exception(f'Failed to get video id because quota exceeded.')
        elif response.status_code != 200:
            self.__logger.critical(f'Unknown error: {json.dumps(response_payload, indent=2)}')
            raise Exception(f'Failed to get video id for league [{league}]. Unknown error: \n{json.dumps(response_payload, indent=2)}')

        self.__logger.debug(f"returning [({response_payload['items'][0]['id']['videoId'], response_payload['items'][0]['snippet']['liveBroadcastContent']})]")

        return (response_payload['items'][0]['id']['videoId'], response_payload['items'][0]['snippet']['liveBroadcastContent'])
    
    def set_api_url(self):
        """
        Sets the api url.
        """
        self.__logger.debug('set_api_url executing')
        self.__google_api_url = f'{self.__google_api_url}&key={self.__youtube_api_key}'

    def set_leagues(self):
        """
        Sets the league dictionary.
        """
        self.__logger.debug('set_leagues executing')
        self.__leagues = {
            'shl': self.__shl_channel_id,
            'smjhl': self.__smjhl_channel_id,
            'wjc': self.__wjc_channel_id,
            'iihf': self.__iihf_channel_id
        }

# database functions

    def set_database_information(self):
        """
        Sets the data base information from a .env.local file in the path given.
        """
        self.__logger.debug(f'set_database_information executing')
        config = dotenv_values(self.__env_file_path)
        self.__mysql_host = config['MYSQL_HOST']
        self.__mysql_database = config['MYSQL_DATABASE']
        self.__mysql_user = config['MYSQL_USER']
        self.__mysql_password = config['MYSQL_PASSWORD']
        self.__youtube_api_key = config['NEXT_PUBLIC_YOUTUBE_API_KEY']
        self.__shl_channel_id = config['NEXT_PUBLIC_SHL_CHANNEL_ID']
        self.__smjhl_channel_id = config['NEXT_PUBLIC_SMJHL_CHANNEL_ID']
        self.__wjc_channel_id = config['NEXT_PUBLIC_SMJHL_CHANNEL_ID']
        self.__iihf_channel_id = config['NEXT_PUBLIC_SMJHL_CHANNEL_ID']

        self.__logger.info(f'imported config file {self.__env_file_path}')

    def connect_to_database(self):
        """
        Connect to the database.
        """
        self.__logger.debug(f'connect_to_database executing')

        self.__mysql_connection = mysql.connector.connect(
            host=self.__mysql_host,
            user=self.__mysql_user,
            password=self.__mysql_password,
            database=self.__mysql_database
        )

        self.__logger.info(f'connected to database')

    def select_all(self):
        """
        Select all from the database table.
        """
        self.__logger.debug(f'select_all executing')
        cursor = self.__mysql_connection.cursor()
        cursor.execute('SELECT * FROM youtube_data')
        result = cursor.fetchall()
        return result

    def update_league(self, league, video_info):
        """
        Update a league in the database to a new video id.
        """
        # separate the tuple to get the individual elements
        video_id = video_info[0]
        video_is_live = video_info[1]

        cursor = self.__mysql_connection.cursor()
        statement = f"UPDATE youtube_data "
        statement = statement + f"SET videoID = '{video_id}', isLive = '{video_is_live}' "
        statement = statement + f"WHERE league = '{league.lower()}'"
        cursor.execute(statement)

        self.__mysql_connection.commit()

        print(f'league [{league}] updated to video id [{video_id}] if it exists.')

# setters/getters

    def set_env_file_path(self, env_file_path):
        """
        Sets the env_file_path.
        """
        self.__logger.debug(f'set_env_file_path executing, args [{env_file_path}]')
        self.__env_file_path = env_file_path

    def get_env_file_path(self):
        """
        Returns the env_file_path.
        """
        self.__logger.debug('get_env_file_path executing')
        return self.__env_file_path

# misc functions

    def create_logger(self, logging_file_name):
        """
        Creates the rotating logger.
        """
        self.__logger = logging.getLogger('YoutubeInfoUpdater')

        if DEBUG:
            self.__logger.setLevel(logging.DEBUG)
        else:
            self.__logger.setLevel(logging.INFO)

        log_path = Path(__file__).absolute().parent.joinpath(logging_file_name)

        # rotating log with 10 Mb max file size, 2 backup files
        handler = RotatingFileHandler(log_path, maxBytes=10000000,
            backupCount= 2)

        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - [%(message)s]')
        handler.setFormatter(formatter)

        self.__logger.addHandler(handler)

# testing functions

    def run_test(self, *args):
        """
        Function to run tests on the class
        """
        pass

if __name__ == '__main__':
    video_updater = YoutubeInfoUpdater()
    video_updater.connect_to_database()

    league_data = {
        'shl'  : video_updater.get_video_info('shl'),
        'smjhl': video_updater.get_video_info('smjhl'),
        'wjc'  : video_updater.get_video_info('wjc'),
        'iihf' : video_updater.get_video_info('iihf')
    }
    
    # update all the leagues
    for league in league_data.keys():
        video_updater.update_league(league, league_data[league])

    print('Update complete')
