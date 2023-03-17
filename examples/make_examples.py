#!/usr/bin/env python

import json
import glob
import os

EXAMPLES_FOLDER = "examples/"

if __name__ == '__main__':
    ret = {}
    files = [
        f for f in glob.glob(EXAMPLES_FOLDER + "**/*.orca", recursive=True)
        if ('osc' not in f) and ('benchmark' not in f) and ('udp' not in f)
    ]

    for path in files:
        print(path)
        with open(path, 'r') as fp:
            contents = fp.read()
            name = os.path.basename(path)[:-5]
            ret[name] = contents

    json_string = json.dumps(ret)
    output = "export const orcaExamples = " + json_string
    with open('scripts/examples.js', 'w') as fp:
        fp.write(output)
