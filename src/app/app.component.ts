import { Component, OnInit } from '@angular/core';
import { OndoWheelOption } from './winwheel/lib/options/winwheel.option';
import { OndoWheel } from './winwheel/lib/winwheel';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  theWheel;
  ngOnInit(): void {
    const option: OndoWheelOption = {
      numSegments: 8,                 // Specify number of segments.
      outerRadius: 200,               // Set outer radius so wheel fits inside the background.
      drawText: true,              // Code drawn text can be used with segment images.
      textFontSize: 16,
      textOrientation: 'curved',
      textAlignment: 'inner',
      textMargin: 90,
      textFontFamily: 'monospace',
      textStrokeStyle: 'black',
      textLineWidth: 3,
      textFillStyle: 'white',
      drawMode: 'segmentImage',    // Must be segmentImage to draw wheel using one image per segemnt.
      segments:                    // Define segments including image and text.
        [
          { image: 'assets/jane.png', text: 'Jane' },
          { image: 'assets/tom.png', text: 'Tom' },
          { image: 'assets/mary.png', text: 'Mary' },
          { image: 'assets/alex.png', text: 'Alex' },
          { image: 'assets/sarah.png', text: 'Sarah' },
          { image: 'assets/bruce.png', text: 'Bruce' },
          { image: 'assets/rose.png', text: 'Rose' },
          { image: 'assets/steve.png', text: 'Steve' }
        ],
      animation:           // Specify the animation to use.
      {
        type: 'spinToStop',
        duration: 5,     // Duration in seconds.
        spins: 8,     // Number of complete spins.
        callbackFinished: 'console.log(this._targets[0].getIndicatedSegment())'
      }
    }
    this.theWheel = new OndoWheel(option, null);
    this.theWheel.drawSegmentImages();
    // this.theWheel.startAnimation();

  }
  // Vars used by the code in this page to do power controls.
  wheelPower = 0;
  wheelSpinning = false;

  // -------------------------------------------------------
  // Function to handle the onClick on the power buttons.
  // -------------------------------------------------------
  powerSelected(powerLevel) {
    // Ensure that power can't be changed while wheel is spinning.
    if (this.wheelSpinning == false) {
      // Reset all to grey incase this is not the first time the user has selected the power.
      document.getElementById('pw1').className = "";
      document.getElementById('pw2').className = "";
      document.getElementById('pw3').className = "";

      // Now light up all cells below-and-including the one selected by changing the class.
      if (powerLevel >= 1) {
        document.getElementById('pw1').className = "pw1";
      }

      if (powerLevel >= 2) {
        document.getElementById('pw2').className = "pw2";
      }

      if (powerLevel >= 3) {
        document.getElementById('pw3').className = "pw3";
      }

      // Set wheelPower var used when spin button is clicked.
      this.wheelPower = powerLevel;

      // Light up the spin button by changing it's source image and adding a clickable class to it.
      (document.getElementById('spin_button') as any).src = "assets/spin_on.png";
      document.getElementById('spin_button').className = "clickable";
    }
  }

  // -------------------------------------------------------
  // Click handler for spin button.
  // -------------------------------------------------------
  startSpin() {
    // Ensure that spinning can't be clicked again while already running.
    if (this.wheelSpinning == false) {
      // Based on the power level selected adjust the number of spins for the wheel, the more times is has
      // to rotate with the duration of the animation the quicker the wheel spins.
      if (this.wheelPower == 1) {
        this.theWheel.animation.spins = 3;
      }
      else if (this.wheelPower == 2) {
        this.theWheel.animation.spins = 8;
      }
      else if (this.wheelPower == 3) {
        this.theWheel.animation.spins = 15;
      }

      // Disable the spin button so can't click again while wheel is spinning.
      // document.getElementById('spin_button').src = "spin_off.png";
      document.getElementById('spin_button').className = "";

      // Begin the spin animation by calling startAnimation on the wheel object.
      this.theWheel.startAnimation();

      // Set to true so that power can't be changed and spin button re-enabled during
      // the current animation. The user will have to reset before spinning again.
      this.wheelSpinning = true;
    }
  }

  // -------------------------------------------------------
  // Function for reset button.
  // -------------------------------------------------------
  resetWheel():boolean {
    this.theWheel.stopAnimation(false);  // Stop the animation, false as param so does not call callback function.
    this.theWheel.rotationAngle = 0;     // Re-set the wheel angle to 0 degrees.
    this.theWheel.draw();                // Call draw to render changes to the wheel.
    document.getElementById('pw1').className = "";  // Remove all colours from the power level indicators.
    document.getElementById('pw2').className = "";
    document.getElementById('pw3').className = "";

    this.wheelSpinning = false;
    return false;        // Reset to false to power buttons and spin can be clicked again.
  }

  // -------------------------------------------------------
  // Called when the spin animation has finished by the callback feature of the wheel because I specified callback in the parameters.
  // -------------------------------------------------------
  alertPrize() {
    // Get the segment indicated by the pointer on the wheel background which is at 0 degrees.
    let winningSegment = this.theWheel.getIndicatedSegment();

    // Do basic alert of the segment text. You would probably want to do something more interesting with this information.
    alert(winningSegment.text + ' says Hi');
  }
}
