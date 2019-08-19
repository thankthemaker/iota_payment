/**
Modified from original example @ Libnfc:
http://nfc-tools.org/index.php?title=Libnfc:APDU_example

Allows testing of Host-based Card Emulatio Android example at
https://github.com/justinribeiro/android-hostcardemulation-sample

Requires Libnfc:
http://nfc-tools.org/index.php?title=Libnfc

To compile:
gcc -o apdu_tag_test apdu_tag_test.c -lnfc
*/
#include <stdlib.h>
#include <string.h>
#include <nfc/nfc.h>
int
CardTransmit(nfc_device *pnd, uint8_t * capdu, size_t capdulen, uint8_t * rapdu, size_t * rapdulen)
{
  int res;
  size_t  szPos;
  printf("=> ");
  for (szPos = 0; szPos < capdulen; szPos++) {
    printf("%02x ", capdu[szPos]);
  }
  printf("\n");
  if ((res = nfc_initiator_transceive_bytes(pnd, capdu, capdulen, rapdu, *rapdulen, 500)) < 0) {
    return -1;
  } else {
    *rapdulen = (size_t) res;
    printf("<= ");
    for (szPos = 0; szPos < *rapdulen; szPos++) {
      printf("%02x ", rapdu[szPos]);
    }
    printf("\n");
    return 0;
  }
}
int
main(int argc, const char *argv[])
{
  nfc_device *pnd;
  nfc_target nt;
  nfc_context *context;
  nfc_init(&context);
  
  printf("\nRunning checks...\n");

  if (context == NULL) {
    printf("Unable to init libnfc (malloc)\n");
    exit(EXIT_FAILURE);
  } 

  const char *acLibnfcVersion = nfc_version();
  (void)argc;
  printf("%s uses libnfc %s\n", argv[0], acLibnfcVersion);

  pnd = nfc_open(context, NULL);

  if (pnd == NULL) {
    printf("ERROR: %s", "Unable to open NFC device.");
    exit(EXIT_FAILURE);
  }
  if (nfc_initiator_init(pnd) < 0) {
    nfc_perror(pnd, "nfc_initiator_init");
    exit(EXIT_FAILURE);
  }

  printf("NFC reader: %s opened\n", nfc_device_get_name(pnd));

  const nfc_modulation nmMifare = {
    .nmt = NMT_ISO14443A,
    .nbr = NBR_106,
  };
  // nfc_set_property_bool(pnd, NP_AUTO_ISO14443_4, true);
  printf("Polling for target...\n");
  while (nfc_initiator_select_passive_target(pnd, nmMifare, NULL, 0, &nt) <= 0);
  printf("Target detected! Running command set...\n\n");
  uint8_t capdu[264];
  size_t capdulen;
  uint8_t rapdu[264];
  size_t rapdulen;
  // Select application
  memcpy(capdu, "\x00\xA4\x04\x00\x07\xF0\x39\x41\x48\x14\x81\x00\x00", 13);
  capdulen=13;
  rapdulen=sizeof(rapdu);

  printf("Sending ADPU SELECT...\n");
  if (CardTransmit(pnd, capdu, capdulen, rapdu, &rapdulen) < 0) {
    exit(EXIT_FAILURE);
  }
  if (rapdulen < 2 || rapdu[rapdulen-2] != 0x90 || rapdu[rapdulen-1] != 0x00) {
    exit(EXIT_FAILURE);
  }
  printf("Application selected!\n\n");

  // Select Capability Container
  memcpy(capdu, "\x00\xa4\x00\x0c\x02\xe1\x03", 7);  
  capdulen=7;
  rapdulen=sizeof(rapdu);
  
  printf("Sending CC SELECT...\n");
  if (CardTransmit(pnd, capdu, capdulen, rapdu, &rapdulen) < 0)
    exit(EXIT_FAILURE);
  if (rapdulen < 2 || rapdu[rapdulen-2] != 0x90 || rapdu[rapdulen-1] != 0x00) {
    capdu[3]='\x00'; // Maybe an older Tag4 ?
    if (CardTransmit(pnd, capdu, capdulen, rapdu, &rapdulen) < 0)
      exit(EXIT_FAILURE);
  }
  printf("Capability Container selected!\n\n");

  // Read Capability Container
  memcpy(capdu, "\x00\xb0\x00\x00\x0f", 5);  
  capdulen=5;
  rapdulen=sizeof(rapdu);
  
  printf("Sending ReadBinary from CC...\n");
  if (CardTransmit(pnd, capdu, capdulen, rapdu, &rapdulen) < 0)
    exit(EXIT_FAILURE);
  if (rapdulen < 2 || rapdu[rapdulen-2] != 0x90 || rapdu[rapdulen-1] != 0x00)
    exit(EXIT_FAILURE);
  printf("\nCapability Container header:\n");
  size_t  szPos;
  for (szPos = 0; szPos < rapdulen-2; szPos++) {
    printf("%02x ", rapdu[szPos]);
  }
  printf("\n\n");

  // NDEF Select
  memcpy(capdu, "\x00\xa4\x00\x0C\x02\xE1\x04", 7);
  capdulen=7;
  rapdulen=sizeof(rapdu);
  printf("Sending NDEF Select...\n");
  if (CardTransmit(pnd, capdu, capdulen, rapdu, &rapdulen) < 0)
    exit(EXIT_FAILURE);
  if (rapdulen < 2 || rapdu[rapdulen-2] != 0x90 || rapdu[rapdulen-1] != 0x00)
    exit(EXIT_FAILURE);
  printf("\n");

  // ReadBinary
  memcpy(capdu, "\x00\xb0\x00\x00\x02", 5);
  capdulen=5;
  rapdulen=sizeof(rapdu);
  printf("Sending ReadBinary NLEN...\n");
  if (CardTransmit(pnd, capdu, capdulen, rapdu, &rapdulen) < 0)
    exit(EXIT_FAILURE);
  if (rapdulen < 2 || rapdu[rapdulen-2] != 0x90 || rapdu[rapdulen-1] != 0x00)
    exit(EXIT_FAILURE);
  printf("\n");

  // ReadBinary - Get NDEF data
  memcpy(capdu, "\x00\xb0\x00\x00\x0f", 5);
  capdulen=5;
  rapdulen=sizeof(rapdu);
  printf("Sending ReadBinary, get NDEF data...\n");
  if (CardTransmit(pnd, capdu, capdulen, rapdu, &rapdulen) < 0)
    exit(EXIT_FAILURE);
  if (rapdulen < 2 || rapdu[rapdulen-2] != 0x90 || rapdu[rapdulen-1] != 0x00)
    exit(EXIT_FAILURE);
  printf("\n");

  // UpdateBinary - send NDEF data
 // memcpy(capdu, "\x00\xd6\x00\x00\x05\xd1\x01\x0D\x55\x01\x61\x64\x61\x66\x72\x75\x69\x74\x2E\x63\x6F\x6D", 22); 

  if (argc >= 2) {
   char source[strlen( argv[1] )];
   strcpy(source, argv[1]);
   int len = strlen( source );

   capdu[0]  = 0x00; // Class byte (CLA)
   capdu[1]  = 0xd6; // Instruction byte (INS) for UpdateBinary command
   capdu[2]  = 0x00; // Parameter byte (P1), offset inside the CC file
   capdu[3]  = 0x00; // Parameter byte (P2), offset inside the CC file
   capdu[4]  = 0x05; // Le field

   capdu[5]  = 0xd1; // NDEF Record Header
   capdu[6]  = 0x01; // Type Length of RTI
   capdu[7]  = len+1; // Payload Length
   capdu[8]  = 0x55; // Record Type Indicator (0x55 or 'U' = URI Record)

   capdu[9]  = 0x01; // start of payload, here URI Identifier ("http://www.")

   for (int i = 0; i <= len; i++){
     capdu[i+10] = source[i];
   }
   capdulen = 10 + len;

   rapdulen=sizeof(rapdu);
   printf("Sending UpdateBinary, send NDEF data...\n");
   if (CardTransmit(pnd, capdu, capdulen, rapdu, &rapdulen) < 0)
     exit(EXIT_FAILURE);
   if (rapdulen < 2 || rapdu[rapdulen-2] != 0x90 || rapdu[rapdulen-1] != 0x00)
     exit(EXIT_FAILURE);
   printf("\n");
  }

  printf("Wrapping up, closing session.\n\n");

  nfc_close(pnd);
  nfc_exit(context);
  exit(EXIT_SUCCESS);
}