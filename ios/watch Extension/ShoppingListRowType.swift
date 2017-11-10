//
//  ShoppingListRowType.swift
//  SousChefWatch WatchKit Extension
//
//  Created by Darshan Patel on 10/21/17.
//  Copyright © 2017 Darshan Patel. All rights reserved.
//

import UIKit
import WatchKit

class ShoppingListRowType: NSObject {
    @IBOutlet var checkBoxImage: WKInterfaceImage!
    var state: Bool
    let checkedImage = UIImage(named: "checked")
    let uncheckedImage = UIImage(named: "unchecked")
    
    @IBOutlet var itemQuantityLabel: WKInterfaceLabel!
    @IBOutlet var itemNameLabel: WKInterfaceLabel!
    @IBOutlet var shoppingRow: WKInterfaceGroup!
    var itemName: String
    var categoryName: String
    override init() {
        state = false
        itemName = ""
        categoryName = ""
    }

    @IBAction func checkButtonOnClick() {
        if (state) {
            checkBoxImage.setImage(uncheckedImage)
        } else {
            checkBoxImage.setImage(checkedImage)
        }
        state = !state
        checkedButton()
        
    }
    
    func checkedButton() {
        if (itemName != "") {
            let path: String = state ? "item_checked" : "item_unchecked"
            
            let itemNameEncoded: String = self.itemName.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed)!
            let categoryNameEncoded: String = self.categoryName.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed)!

            let url = URL(string: "https://souschef-182502.appspot.com/api/v1/users/" + path + "?user_id=" + mainInstance.user + "&item=" + itemNameEncoded + "&category=" + categoryNameEncoded)
            URLSession.shared.dataTask(with: url!, completionHandler: {
                (data, response, error) in
                if(error != nil){
                    print("error")
                }
            }).resume()
        }
        
    }
}
