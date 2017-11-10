//
//  DirectionsInterfaceController.swift
//  SousChefWatch WatchKit Extension
//
//  Created by Darshan Patel on 10/19/17.
//  Copyright © 2017 Darshan Patel. All rights reserved.
//

import WatchKit
import Foundation

class DirectionsInterfaceController: WKInterfaceController {

    @IBOutlet var directionsLabel: WKInterfaceLabel!
    @IBOutlet var nextButton: WKInterfaceButton!
    @IBOutlet var backButton: WKInterfaceButton!

    var currElement: Int = 1
    var directionsList: [String] = []
    
    @IBAction func backButtonClick() {
        currElement -= 1
        enableAndDisableButtons()
        directionsLabel.setText(directionsList[currElement - 1])
    }
    @IBAction func nextButtonClick() {
        currElement += 1
        enableAndDisableButtons()
        directionsLabel.setText(directionsList[currElement - 1])
    }
    override func awake(withContext context: Any?) {
        super.awake(withContext: context)
        self.enableAndDisableButtons()

        let url = URL(string: "https://souschef-182502.appspot.com/api/v1/recipes/recipe_details?recipe_id=99184")
        URLSession.shared.dataTask(with: url!, completionHandler: {
            (data, response, error) in
            if(error != nil){
                print("error")
            }else{
                do{
                    let json = try JSONSerialization.jsonObject(with: data!, options:.allowFragments) as! [String : AnyObject]
                    let instructionsArr = json["analyzedInstructions"] as! [AnyObject]
                    let instructions = instructionsArr[0] as! [String: AnyObject]
                    self.processInputJson(input: instructions["steps"] as! [AnyObject])
                    
                    self.directionsLabel.setText(self.directionsList[self.currElement - 1])
                    
                    
                    self.enableAndDisableButtons()
                    
                    OperationQueue.main.addOperation({
                        
                    })
                    
                }catch let error as NSError{
                    print(error)
                }
            }
        }).resume()
        
        

        // Configure interface objects here.
    }
    
    func processInputJson(input: [AnyObject]) {
        for (key) in input {
            let instructionObject = key as! [String: AnyObject]

            let step: String = String(instructionObject["number"] as! Int) + ". " + (instructionObject["step"] as! String)
            directionsList.append(step)
        }
        
    }
    
    override func willActivate() {
        // This method is called when watch view controller is about to be visible to user
        super.willActivate()
    }

    override func didDeactivate() {
        // This method is called when watch view controller is no longer visible
        super.didDeactivate()
    }
    
    func enableAndDisableButtons() {
        if currElement == 1 {
            backButton.setBackgroundColor(UIColor(red: 25, green: 25, blue: 25, alpha: 0.2))
            backButton.setHidden(true)

        } else {
            backButton.setBackgroundColor(UIColor.darkGray)
            backButton.setHidden(false)
            backButton.setTitle("< Step " + String(currElement - 1))

        }
        
        if currElement == directionsList.count || directionsList.count == 0 {
            nextButton.setBackgroundColor(UIColor(red: 25, green: 25, blue: 25, alpha: 0.2))
            nextButton.setHidden(true)

        } else {
            nextButton.setBackgroundColor(UIColor.darkGray)
            nextButton.setTitle("Step " + String(currElement + 1) + " >")

            nextButton.setHidden(false)

        }
    }

}
