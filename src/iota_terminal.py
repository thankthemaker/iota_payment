import sys
sys.path.append("/usr/src/app/lib")
# Imports some required libraries
import iota
from iota import Address
import RPi.GPIO as GPIO
import MFRC522
import signal
import time
import regex

from luma.core.interface.serial import i2c
from luma.core.render import canvas
from luma.oled.device import ssd1306

# Import library for 4x3 keypad
from keypad import keypad

# rev.1 users set port=0
# substitute spi(device=0, port=0) below if using that interface
serial = i2c(port=1, address=0x3C)

# substitute ssd1331(...) or sh1106(...) below if using that device
device = ssd1306(serial)

# Define keypad object
kp = keypad()

# Varibles to control and collect keypad input
pos = 0
sumstring = ""
pincode = ""
pinmode = False
##keypad_reading = True
keypad_reading = False

# Setup O/I PIN's
LEDPIN=12
GPIO.setmode(GPIO.BOARD)
GPIO.setwarnings(False)
GPIO.setup(LEDPIN,GPIO.OUT)
GPIO.output(LEDPIN,GPIO.LOW)

# URL to IOTA fullnode used when interacting with the Tangle
iotaNode = "https://field.deviota.com:443"
api = iota.Iota(iotaNode, "")

# Preparing hotel owner recieving address, replace with your own recieving address
hotel_address = b'GTZUHQSPRAQCTSQBZEEMLZPQUPAA9LPLGWCKFNEVKBINXEXZRACVKKKCYPWPKH9AWLGJHPLOZZOYTALAWOVSIJIYVZ'

# Some variables to control program flow 
continue_reading = True
transaction_confirmed = False
       
# Capture SIGINT for cleanup when the script is aborted
def end_read(signal,frame):
    global continue_reading
    print("Ctrl+C captured, ending read.")
    continue_reading = False
    GPIO.cleanup()


# Function that reads the seed stored on the IOTA debit card
def read_seed():
    
    seed = ""
    seed = seed + read_block(8)
    seed = seed + read_block(9)
    seed = seed + read_block(10)
    seed = seed + read_block(12)
    seed = seed + read_block(13)
    seed = seed + read_block(14)
    
    # Return the first 81 characters of the retrieved seed
    return seed[0:81]

# Function to read single block from RFID tag
def read_block(blockID):

    status = MIFAREReader.MFRC522_Auth(MIFAREReader.PICC_AUTHENT1A, blockID, key, uid)
    
    if status == MIFAREReader.MI_OK:
        
        str_data = ""
        int_data=(MIFAREReader.MFRC522_Read(blockID))
        for number in int_data:
            str_data = str_data + chr(number)
        return str_data
    else:
        printMessage('Auth error......', 'Trans aborted...', 2000);

# Function for checking address balance 
def checkbalance(hotel_address):
    
    address = Address(hotel_address)
    gb_result = api.get_balances([address])
    balance = gb_result['balances']
    return (balance[0])

# Function that blinks the LED
def blinkLED(blinks):
    for x in range(blinks):
        GPIO.output(LEDPIN,GPIO.HIGH)
        time.sleep(1)
        GPIO.output(LEDPIN,GPIO.LOW)
        time.sleep(1)

# Validate that PIN consist of 4 digit's
def validate_pin(pin):
    if pin == "" or regex.fullmatch("\d{4}", pin):
        return True
    else:
        return False

# Create a 16 element list inkl. new PIN to be written to autorization block
def make_pin(pin):
    if pin == "":
        pin_data = [255, 255, 255, 255, 255, 255, 255, 7, 128, 105, 255, 255, 255, 255, 255, 255]
    else:
        pin_data=[]
        pin_letter_list = list(pin)
        for letter in pin_letter_list:
            pin_data.append(ord(letter))
        pin_data = pin_data + [255, 255, 255, 7, 128, 105, 255, 255, 255, 255, 255, 255]

    return pin_data

def printMessage(msg1, msg2, waitMillis):
    with canvas(device) as draw:
        draw.rectangle(device.bounding_box, outline="white", fill="black")
        draw.text((10, 5), msg1, fill="white")
        if(msg2 != ""):
            draw.text((30, 5), msg2, fill="white")
    if(waitMillis > 0):
        time.sleep(waitMillis)
        device.clear()
    
    

# Get hotel owner address balance at startup
currentbalance = checkbalance(hotel_address)
lastbalance = currentbalance

# Hook the SIGINT
signal.signal(signal.SIGINT, end_read)

# Create an object of the class MFRC522
MIFAREReader = MFRC522.MFRC522()

# Show welcome message
printMessage('Number of Blinks', '', 0);

# Loop while getting keypad input
while keypad_reading:

    # Loop while waiting for a keypress
    digit = None
 ##   while digit == None:
 ##       digit = kp.getKey()
   
    # Manage keypad input
    if pinmode == False:
        if digit == '*':
 ##           mylcd.lcd_display_string(" ", 2, pos-1)
            pos = pos -1
            sumstring = sumstring[:-1]
        elif digit == '#':
            blinks = int(sumstring)
            printMessage('PIN code:', '', 0);
            pinmode = True
            pos = 0
        else:
##            mylcd.lcd_display_string(str(digit), 2, pos)
            pos = pos +1
            sumstring = sumstring + str(digit)
    else:
        if digit == '*':
##            mylcd.lcd_display_string(" ", 2, pos-1)
            pos = pos -1
            pincode = pincode[:-1]
        elif digit == '#':
            
            keypad_reading = False
            
        else:
            if pos <= 3:
##                mylcd.lcd_display_string('*', 2, pos)
                pos = pos +1
                pincode = pincode + str(digit)
 
    time.sleep(0.3)


# Show waiting for card message
printMessage('Waiting for card', '', 0);

# This loop keeps checking for near by RFID tags. If one is found it will get the UID and authenticate
while continue_reading:
               
    # Scan for cards    
    (status,TagType) = MIFAREReader.MFRC522_Request(MIFAREReader.PICC_REQIDL)

    # If a card is found
    if status == MIFAREReader.MI_OK:
        printMessage('Card detected...', '', 0);
    
    # Get the UID of the card
    (status,uid) = MIFAREReader.MFRC522_Anticoll()

    # If we have the UID, continue
    if status == MIFAREReader.MI_OK:
   
        # Get authentication key
        key = make_pin(pincode)[0:6]
        
        # Select the scanned tag
        MIFAREReader.MFRC522_SelectTag(uid)
        
        # Get seed from IOTA debit card
        SeedSender=read_seed()
        
        # Stop reading/writing to RFID tag
        MIFAREReader.MFRC522_StopCrypto1()
                      
        # Create PyOTA object using seed from IOTA debit card
        api = iota.Iota(iotaNode, seed=SeedSender)
        
        # Display checking funds message
        printMessage('Checking funds..', 'Please wait.....', 0)
              
        # Get available funds from IOTA debit card seed
        card_balance = api.get_account_data(start=0, stop=None)
            
        balance = card_balance['balance']
        
        # Check if enough funds to pay for service
        if balance < blinks:
            printMessage('No funds........', 'Trans aborted...', 0)
            exit()
        
        # Create new transaction
        tx1 = iota.ProposedTransaction( address = iota.Address(hotel_address), message = None, tag = iota.Tag(b'HOTEL9IOTA'), value = blinks)

        # Display sending transaction message
        printMessage('Sending trans...', 'Please wait.....', 0)

        # Send transaction to tangle
        SentBundle = api.send_transfer(depth=3,transfers=[tx1], inputs=None, change_address=None, min_weight_magnitude=14, security_level=2)
                       
        # Display confirming transaction message
        printMessage('Confirming trans', 'Please wait.....', 0)
        
        # Loop executes every 10 seconds to checks if transaction is confirmed
        while transaction_confirmed == False:
            currentbalance = checkbalance(hotel_address)
            if currentbalance > lastbalance:
                printMessage('Success!!!......', 'Trans confirmed.', 0)
                #print("\nTransaction is confirmed")
                blinkLED(blinks)
                transaction_confirmed = True
                continue_reading = False
            time.sleep(10)