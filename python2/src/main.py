from AWSIoTPythonSDK.MQTTLib import AWSIoTMQTTClient
import os
import logging
import time
import json
import subprocess

# Custom MQTT message callback
def msgCallback(client, userdata, message):
    print("Received a new message: ")
    jsonMsg = json.loads(message.payload)
    try:
        if jsonMsg['command'] == "hcepayment":
            print("command: " + jsonMsg['command'])
            print("--------------\n\n")
            while subprocess.call(["/usr/src/app/src/apdu_tag_test", message.payload]) != 0:
                print()"reading hce...")

#            message = {}
#            message['command'] = "coffee"
#            message['product'] = "PAA"
#            messageJson = json.dumps(message)
#            myAWSIoTMQTTClient.publish("/iota-poc", messageJson, 1)
    except Exception as exp:
        print("Exception occured: ")
        print(exp)

if __name__ == '__main__':
    clientId = "python2-card-reader"
    host = os.getenv("AWS_HOST", "a3dtjrh1oco8co.iot.eu-central-1.amazonaws.com")
    port = os.getenv("AWS_PORT", 443)
    ca_cert_path = os.getenv("AWS_CA_CERT_PATH", ".")


    # Configure logging
    logger = logging.getLogger("AWSIoTPythonSDK.core")
    logger.setLevel(logging.INFO)
    streamHandler = logging.StreamHandler()
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    streamHandler.setFormatter(formatter)
    logger.addHandler(streamHandler)

    # Init AWSIoTMQTTClient
    myAWSIoTMQTTClient = None
    myAWSIoTMQTTClient = AWSIoTMQTTClient(clientId, useWebsocket=True)
    myAWSIoTMQTTClient.configureEndpoint(host, port)
    myAWSIoTMQTTClient.configureCredentials(ca_cert_path  + "/VeriSign-Class 3-Public-Primary-Certification-Authority-G5.pem"), 

    # AWSIoTMQTTClient connection configuration
    myAWSIoTMQTTClient.configureAutoReconnectBackoffTime(1, 32, 20)
    myAWSIoTMQTTClient.configureOfflinePublishQueueing(-1)  # Infinite offline Publish queueing
    myAWSIoTMQTTClient.configureDrainingFrequency(2)  # Draining: 2 Hz
    myAWSIoTMQTTClient.configureConnectDisconnectTimeout(10)  # 10 sec
    myAWSIoTMQTTClient.configureMQTTOperationTimeout(5)  # 5 sec

    # Connect and subscribe to AWS IoT
    myAWSIoTMQTTClient.connect()
    myAWSIoTMQTTClient.subscribe("/iota-poc", 1, msgCallback)
    time.sleep(2)

    # Publish to the same topic in a loop forever
    loopCount = 0
    while True:
        loopCount += 1
        time.sleep(5)