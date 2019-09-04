from AWSIoTPythonSDK.MQTTLib import AWSIoTMQTTClient
import logging
import time
import json

# Custom MQTT message callback
def customCallback(client, userdata, message):
    print("Received a new message: ")
    jsonMsg = json.loads(message.payload)
    print("command: " + jsonMsg['command'])
    print("--------------\n\n")

clientId = "python2-card-reader"
host = "a3dtjrh1oco8co.iot.eu-central-1.amazonaws.com"
port = 443

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
myAWSIoTMQTTClient.configureCredentials(
    "/Users/dgey/Desktop/Zertifikate/VeriSign-Class 3-Public-Primary-Certification-Authority-G5.pem.txt")#, 
##    "/Users/dgey/Desktop/Zertifikate/50b9b5f66d-private.pem.key", 
##    "/Users/dgey/Desktop/Zertifikate/50b9b5f66d-certificate.pem.crt")


# AWSIoTMQTTClient connection configuration
myAWSIoTMQTTClient.configureAutoReconnectBackoffTime(1, 32, 20)
myAWSIoTMQTTClient.configureOfflinePublishQueueing(-1)  # Infinite offline Publish queueing
myAWSIoTMQTTClient.configureDrainingFrequency(2)  # Draining: 2 Hz
myAWSIoTMQTTClient.configureConnectDisconnectTimeout(10)  # 10 sec
myAWSIoTMQTTClient.configureMQTTOperationTimeout(5)  # 5 sec

# Connect and subscribe to AWS IoT
myAWSIoTMQTTClient.connect()
myAWSIoTMQTTClient.subscribe("/iota-poc", 1, customCallback)
time.sleep(2)

# Publish to the same topic in a loop forever
loopCount = 0
while True:
    message = {}
    message['message'] = "test"
    message['sequence'] = loopCount
    messageJson = json.dumps(message)
    myAWSIoTMQTTClient.publish("/iota-poc", messageJson, 1)
    loopCount += 1
    time.sleep(5)
