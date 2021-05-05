#! /bin/bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# check if we need to install the virtual environment
if [ ! -d "$SCRIPT_DIR/.venv" ]; then
    python3 -m venv .venv
    source $SCRIPT_DIR/.venv/bin/activate
    pip install -r $SCRIPT_DIR/requirements.txt
else
    source $SCRIPT_DIR/.venv/bin/activate
fi

python3 $SCRIPT_DIR/youtube_info_updater.py
