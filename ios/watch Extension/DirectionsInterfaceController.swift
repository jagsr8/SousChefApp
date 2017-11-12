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

    @IBOutlet var recipeTitleLabel: WKInterfaceLabel!
    @IBOutlet var directionsLabel: WKInterfaceLabel!
    @IBOutlet var nextButton: WKInterfaceButton!
    @IBOutlet var backButton: WKInterfaceButton!

    var currElement: Int = 1
    var directionsList: [String] = []
  var currentRecipeID: String = ""
    
    @IBAction func backButtonClick() {
        currElement -= 1
        enableAndDisableButtons()
        directionsLabel.setText(directionsList[currElement - 1])
        setCurrentRecipeStep()
    }
    @IBAction func nextButtonClick() {
        currElement += 1
        enableAndDisableButtons()
        directionsLabel.setText(directionsList[currElement - 1])
        setCurrentRecipeStep()
    }
    override func awake(withContext context: Any?) {
        super.awake(withContext: context)
        self.enableAndDisableButtons()
        getCurrentRecipeDirections()
        // Configure interface objects here.
    }
  
  func getCurrentRecipeDirections() {
    let url = URL(string: "https://souschef-182502.appspot.com/api/v1/users/get_current_recipe_progress?user_id=" + mainInstance.user)
    URLSession.shared.dataTask(with: url!, completionHandler: {
      (data, response, error) in
      if(error != nil){
        print("error")
      }else{
        do{
          let json = try JSONSerialization.jsonObject(with: data!, options:.allowFragments) as! [String : AnyObject]
          let recipeId = json["recipe_id"] as! String
          self.currentRecipeID = recipeId
          let step = json["step"] as! String
          self.currElement = Int(step)!
          self.getRecipeDirections(recipeId: recipeId)
          
        }catch let error as NSError{
          print(error)
        }
      }
    }).resume()
  }
  
  func getRecipeDirections(recipeId: String) {
    let url = URL(string: "https://souschef-182502.appspot.com/api/v1/recipes/recipe_details?recipe_id=" + recipeId)
    URLSession.shared.dataTask(with: url!, completionHandler: {
      (data, response, error) in
      if(error != nil){
        print("error")
      }else{
        do{
          let json = try JSONSerialization.jsonObject(with: data!, options:.allowFragments) as! [String : AnyObject]
          let recipeTitle = json["title"] as! String
            self.recipeTitleLabel.setText(recipeTitle)
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
  }
  
  func setCurrentRecipeStep() {
    let baseUrl: String = "https://souschef-182502.appspot.com/api/v1/users/save_current_recipe_progress?user_id=" + mainInstance.user
    let queryParameters: String = "&step=" + String(currElement) + "&recipe_id=" + currentRecipeID
    let urlString: String = baseUrl + queryParameters
    let url = URL(string: urlString)
    URLSession.shared.dataTask(with: url!, completionHandler: {
      (data, response, error) in
      if(error != nil){
        print("error")
      }else{
        do{
          let json = try JSONSerialization.jsonObject(with: data!, options:.allowFragments) as! [String : AnyObject]
          let recipeId = json["recipe_id"] as! String
          let step = json["step"] as! String
          self.currElement = Int(step)!
          self.getRecipeDirections(recipeId: recipeId)
          
        }catch let error as NSError{
          print(error)
        }
      }
    }).resume()
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
