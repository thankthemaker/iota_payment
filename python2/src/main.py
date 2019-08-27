from flask import Flask
import subprocess


app = Flask(__name__)

@app.route('/')
def hello_world():
    output = subprocess.check_output(["ls","-l"])
    return output

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)
