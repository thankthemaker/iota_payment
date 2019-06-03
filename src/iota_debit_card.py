import sys
sys.path.append("/usr/src/app/lib")
from iota import Iota
import random
import RPi.GPIO as GPIO
import MFRC522
import signal
from textwrap import wrap

# Set seed to <blank>
seed=""

# URL to IOTA fullnode used when checking balance and free addresses
iotaNode = "https://field.deviota.com:443"

# Function the generates and returns a random seed
def generate_seed():
    chars=u'9ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    rndgenerator = random.SystemRandom()
    new_seed = u''.join(rndgenerator.choice(chars) for _ in range(81))
    return new_seed

# Function the validates seed length
def seed_check_length(seed):
    if len(seed) == 81:
        return True
    else:
        return False

# Function that validates seed characters
def seed_check_chars(seed):
    allowed_chars = set("ABCDEFGHIJKLMNOPQRSTUVWXYZ9")
    if set(seed).issubset(allowed_chars):
        return True
    else:
        return False

# Show main menu
print ("""
1.Assign manual seed to IOTA debit card 
2.Assign automatic seed to IOTA debit card
3.Display seed stored on IOTA debit card
4.Display IOTA debit card seed balance
5.Display IOTA debit card seed transfer address
""")

# Get user selection
ans=input("What would you like to do? ")

# In case 1, get manual seed from user
if ans=="1":
    seed = raw_input("\nWrite or paste seed here: ")

    # Check that seed length is correct
    if seed_check_length(seed) == False:
        print("Invalid seed length")
        exit()

    # Check that seed contains only valid characters
    if seed_check_chars(seed) == False:
        print("Seed contains invalid characters")
        exit()

# In case 2, get seed from seed generator function
elif ans=="2":
    print("\nGenerating new seed...")
    seed = generate_seed()
   
continue_reading = True
       
# Capture SIGINT for cleanup when the script is aborted
def end_read(signal,frame):
    global continue_reading
    print("Ctrl+C captured, ending read.")
    continue_reading = False
    GPIO.cleanup()

# Function to write seed to IOTA debit card
def write_seed(seed):
    
    # Add additional characters to seed so that we have a total of 6x16 characters 
    seed = seed + '999999999999999'       

    # Convert seed to a list of 6x16 characters  
    mylist = wrap(seed, 16)

    # Write seed over 6 separate blocks
    write_block(8, mylist[0])
    write_block(9, mylist[1])
    write_block(10, mylist[2])           
    write_block(12, mylist[3])
    write_block(13, mylist[4])
    write_block(14, mylist[5])


# Function to write single block to RFID tag
def write_block(blockID, str_data):

    status = MIFAREReader.MFRC522_Auth(MIFAREReader.PICC_AUTHENT1A, blockID, key, uid)
    
    if status == MIFAREReader.MI_OK:
        
        data=[]
        for letter in str_data:
            data.append(ord(letter))
        MIFAREReader.MFRC522_Write(blockID, data)
        
    else:
        print("Authentication error")


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
        print("Authentication error")


# Hook the SIGINT
signal.signal(signal.SIGINT, end_read)

# Create an object of the class MFRC522
MIFAREReader = MFRC522.MFRC522()

# Display scan IOTA debit card message
print("\nHold IOTA debit card close to reader...")

# This loop keeps checking for near by RFID tags. If one is found it will get the UID and authenticate
while continue_reading:
       
    # Scan for cards    
    (status,TagType) = MIFAREReader.MFRC522_Request(MIFAREReader.PICC_REQIDL)

    # If a card is found
    if status == MIFAREReader.MI_OK:
        print("Card detected")
    
    # Get the UID of the card
    (status,uid) = MIFAREReader.MFRC522_Anticoll()

    # If we have the UID, continue
    if status == MIFAREReader.MI_OK:

        # Print UID
        print("Card read UID: %s,%s,%s,%s" % (uid[0], uid[1], uid[2], uid[3]))
    
        # This is the default key for authentication
        key = [0xFF,0xFF,0xFF,0xFF,0xFF,0xFF]
        
        # Select the scanned tag
        MIFAREReader.MFRC522_SelectTag(uid)
        
        # Write seed to IOTA debit card
        if ans=="1" or ans=="2":
            
            # Write seed to IOTA debit card
            write_seed(seed)
            
            # Show end message
            print("\nThe following seed was sucessfully added to the IOTA debit card")
            print(seed[0:81])
            
        
        # Display seed stored on IOTA debit card    
        elif ans=="3":
            
            # Get seed from IOTA debit card
            seed=read_seed()
            
            # Display seed stored on the IOTA debit card
            print("\nThe IOTA debit card has the following seed: ")
            print(seed)
        
        # Display balance of seed stored on IOTA debit card
        elif ans=="4":
            
            # Get seed from IOTA debit card
            seed=read_seed()

            # Create an IOTA object
            api = Iota(iotaNode, seed)
            
            print("\nChecking IOTA debit card balance. This may take some time...")

            # Get balance for the IOTA debit card seed
            card_balance = api.get_account_data(start=0, stop=None)
            
            balance = card_balance['balance']
            
            print("\nIOTA debit card balance is: " + str(balance) + " IOTA")
        
        # Display next unused address of seed stored on IOTA debit card
        elif ans=="5":
            
            # Get seed from IOTA debit card
            seed=read_seed()
            
            # Create an IOTA object
            api = Iota(iotaNode, seed)
            
            print("\nGetting next available IOTA address. This may take some time...")
            
            # Get next available address without any transactions
            result = api.get_new_addresses(index=0, count=None, security_level=2)
            
            addresses = result['addresses']
            
            addr=str(addresses[0].with_valid_checksum())
            
            print("\nUse the following IOTA address when transfering new funds to IOTA debit card:")
            print(addr)

           
        # Stop reading/writing to RFID tag
        MIFAREReader.MFRC522_StopCrypto1()
        
       
        # Make sure to stop reading for cards
        continue_reading = False