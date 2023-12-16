import gpiozero
import math, os, time

pin_rotary_enable = 23    # red cable
pin_count_rotary = 24    # orange cable
pulses_per_number = 20

rotaryenable = gpiozero.Button(pin_rotary_enable)
countrotary = gpiozero.Button(pin_count_rotary)

class Dial():
    # Handling rotary dial input.
    def __init__(self):
        # Initialize
        os.system('clear')
        print("Ready to dial")
        self.pulses = 0
        self.number = 0
        self.counting = True

    def startcounting(self):
        # Start counting pulses
        os.system('clear')
        print("Counting pulses")
        self.counting = True

    def stopcounting(self):
        # Stop counting, calculate dialed number and reset values
        # Reset number
        self.number = 0
        os.system('clear')
        print("Got %s pulses" % self.pulses)
        print("_ _ _ _ _ _ _ _ _ _ _ _ _")
        print("")

        # Calculate dialed number
        if self.pulses > 0:
            if math.floor(self.pulses / pulses_per_number) >= 10:
                self.number = 0
            else:
                self.number = math.ceil((self.pulses / pulses_per_number))
            print("The number %s was dialed" % self.number)
        else:
            print("No input detected")

        # Reset values
        self.counting = False
        self.pulses = 0

    def addpulse(self):
        # Add pulse to the count
        if self.counting:
            self.pulses += 1

def main():
    dial = Dial()
    countrotary.when_deactivated = dial.addpulse
    countrotary.when_activated = dial.addpulse
    rotaryenable.when_activated = dial.startcounting
    rotaryenable.when_deactivated = dial.stopcounting
    while True:
        time.sleep(1)

if __name__ == "__main__":
    main()
