//
//  TMapShowManager.swift
//  EVChargerApp
//
//  Created by Joseph Kim on 2021/03/14.
//

import Foundation

import TMapSDK

@objc(TMapShowManager)
class TMapShowManager: RCTViewManager {
  override func view() -> UIView! {
    return TMapShow()
  }
  
  override static func requiresMainQueueSetup() -> Bool {
      return true
}
}
