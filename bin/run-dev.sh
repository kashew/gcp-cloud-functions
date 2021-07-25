#!/bin/bash

script_full_path=$(dirname "$0")

./$script_full_path/create-docker-image.sh
./$script_full_path/run-docker-image.sh