//
//  ShoppingListInterfaceController.swift
//  SousChefWatch WatchKit Extension
//
//  Created by Darshan Patel on 10/21/17.
//  Copyright © 2017 Darshan Patel. All rights reserved.
//

import WatchKit
import Foundation

class ShoppingListInterfaceController: WKInterfaceController {

    @IBOutlet var shoppingListTable: WKInterfaceTable!

    
    override func awake(withContext context: Any?) {
        super.awake(withContext: context)
        //set loading text
        shoppingListTable.insertRows(at: IndexSet.init(integer: shoppingListTable.numberOfRows), withRowType: "ShoppingListHeader")
        let row: ShoppingListHeaderType = shoppingListTable.rowController(at: shoppingListTable.numberOfRows - 1) as! ShoppingListHeaderType
        row.headerLabel.setText("Loading...")
        
        let url = URL(string: "https://souschef-182502.appspot.com/api/v1/users/shopping_list?user_id=" + mainInstance.user)
        URLSession.shared.dataTask(with: url!, completionHandler: {
            (data, response, error) in
            if(error != nil){
                print("error")
            }else{
                do{
                    let json = try JSONSerialization.jsonObject(with: data!, options:.allowFragments) as! [String : [String : [String : AnyObject]]]
                    self.shoppingListTable.removeRows(at: IndexSet.init(integer: 0)) //remove Loading text
                    self.processInputJson(input: json)

                    OperationQueue.main.addOperation({
                    })

                }catch let error as NSError{
                    print(error)
                }
            }
        }).resume()
    
        
    }
    
    func processInputJson(input: [String : [String : [String : AnyObject]]]) {
        for (key, value) in input {
            shoppingListTable.insertRows(at: IndexSet.init(integer: shoppingListTable.numberOfRows), withRowType: "ShoppingListHeader")
            let row: ShoppingListHeaderType = shoppingListTable.rowController(at: shoppingListTable.numberOfRows - 1) as! ShoppingListHeaderType
            row.headerLabel.setText(key)
            for (item, details) in value {
                addShoppingListRow(name: item, category: key, input: details)
            }
        }
        
    }
    
    func addShoppingListRow(name: String, category: String, input: [String : AnyObject]) {
        var itemName: String = ""
        var isDone: Bool = false
        var quantityList: String = ""
        
        itemName = name
        isDone = input["Done"] as! Bool
        
        
        if (input["UnitMap"] as? [String : AnyObject]) != nil  {
            let unitMap = input["UnitMap"] as! [String : AnyObject]
            for (unit, quantity) in unitMap {
                quantityList = quantityList + ", " + String(format:"%.1f", quantity.doubleValue) + " " + unit
            }
            quantityList.remove(at: String.Index.init(encodedOffset: 0))
            quantityList.remove(at: String.Index.init(encodedOffset: 0))
        }
        
        shoppingListTable.insertRows(at: IndexSet.init(integer: shoppingListTable.numberOfRows), withRowType: "ShoppingListRowType")
        let row: ShoppingListRowType = shoppingListTable.rowController(at: shoppingListTable.numberOfRows - 1) as! ShoppingListRowType
        
        row.itemNameLabel.setText(itemName)
        row.itemQuantityLabel.setText(quantityList)
        row.state = !isDone
        row.checkButtonOnClick()
        row.itemName = itemName
        row.categoryName = category
        
    }
    
    
    
    override func willActivate() {
        // This method is called when watch view controller is about to be visible to user
        super.willActivate()
    }

    override func didDeactivate() {
        // This method is called when watch view controller is no longer visible
        super.didDeactivate()
    }

}
