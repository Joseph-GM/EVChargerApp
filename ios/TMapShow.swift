//
//  TMapShow.swift
//  EVChargerApp
//
//  Created by Joseph Kim on 2021/03/14.
//

//import Foundation

import UIKit
import TMapSDK

class TMapShow: UIView, TMapViewDelegate {

  
/*  @objc var czoom: NSNumber=10 {
    didSet {
      zoom = Int(truncating: czoom)
    }
  }
  
  var zoom: Int = 1 {
    didSet {
      self.mapView?.setZoom(zoom)
    }
  } */
  
  @objc var zoom: NSNumber = 10
  
  
    var mapView: TMapView?
    var marker: TMapMarker?
    var markers: [TMapMarker] = []
/*    var mPosition: CLLocationCoordinate2D = CLLocationCoordinate2D.init(latitude: 37.5147585, longitude:126.7044424) */
  
//    let zoom = 16
    let apiKey:String = "SK_API"

  @objc var clatitude: NSNumber = 36.121212
  @objc var clongitude: NSNumber = 126.1212121
  @objc var markerdata: NSArray?
  
  var mPosition: CLLocationCoordinate2D {
    get {
      return CLLocationCoordinate2DMake(Double(self.clatitude), Double(self.clongitude))
    }
  }
/* lazy var mPosition: CLLocationCoordinate2D = {
  return CLLocationCoordinate2DMake(Double(self.clatitude), Double(self.clongitude))
  }()
*/
  
  
  
    override init(frame: CGRect) {
        super.init(frame: frame)
        self.backgroundColor = .white
//        setupConstraints()
        setupView()
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemente")
    }
  
    @objc func SKTMapApikeySucceed() {
        self.mapView?.setCenter(mPosition)
        self.mapView?.setZoom(Int(zoom))
        
    
        
        let marker = TMapMarker(position: mPosition)
        marker.title = "현재위치"
        marker.subTitle = "내차위치"
        marker.draggable = true
        let label = UILabel(frame: CGRect(x: 0, y: 0, width: 30, height: 50))
        label.text = "좌측"
        marker.leftCalloutView = label
        let label2 = UILabel(frame: CGRect(x: 0, y: 0, width: 30, height: 50))
        label2.text = "우측"
        marker.rightCalloutView = label2
        
        marker.map = self.mapView
        self.markers.append(marker)
        
      
      if let poiResult = markerdata! as? [[String : AnyObject]] {
        for poi in poiResult {
          print(poi["name"]!)
          print(poi["noorLat"]!)
          let markerLatitude:Double? = Double(poi["noorLat"] as! Substring)
          let markerLongitude:Double? = Double(poi["noorLon"] as! Substring)
          let markerPosition: CLLocationCoordinate2D? = CLLocationCoordinate2D(latitude: markerLatitude!, longitude: markerLongitude!)
          let marker = TMapMarker(position: markerPosition!)
          print(markerPosition)
          marker.map = self.mapView
          marker.title = String(poi["name"] as! Substring)
          self.markers.append(marker)
          self.mapView?.fitMapBoundsWithMarkers(self.markers)
        }
      }
  
/*
       let pathData = TMapPathData()
        pathData.requestFindNameAroundPOI(mPosition, categoryName:"EV충전소", radius: 100, count: 10) { (result, error)->Void in
                    if let result = result {
                        DispatchQueue.main.async {
                            for poi in result {
                                let marker = TMapMarker(position: poi.coordinate!)
                                marker.map = self.mapView
                                marker.title = poi.name
                                self.markers.append(marker)
                                self.mapView?.fitMapBoundsWithMarkers(self.markers)
                            }
                        }
                    }
        }
*/

    }
    

  @objc func setupView() {
        contentView.subviews.forEach { $0.removeFromSuperview() }
        self.mapView = TMapView (frame: contentView.frame)
        self.mapView?.setCenter(mPosition)
        self.mapView?.setZoom(Int(zoom))
        self.mapView?.delegate = self
        self.mapView?.setApiKey(apiKey)
                
        contentView.addSubview(self.mapView!)
        
        self.addSubview(contentView)
    }
    
    
    @objc func setupConstraints() {
        self.translatesAutoresizingMaskIntoConstraints = false
        contentView.translatesAutoresizingMaskIntoConstraints = false
        contentView.leftAnchor.constraint(equalTo: self.leftAnchor, constant: 10).isActive = true
        contentView.topAnchor.constraint(equalTo: self.safeAreaLayoutGuide.topAnchor, constant: 20).isActive = true
        contentView.rightAnchor.constraint(equalTo: self.rightAnchor, constant: -10).isActive = true
        contentView.bottomAnchor.constraint(equalTo: self.centerYAnchor, constant: 300).isActive = true
    }
    
    let contentView: UIView = {

        let bounds = UIScreen.main.bounds
        let width = bounds.width
      let height = bounds.height*0.75
      
      let view = UIView(frame: CGRect(x: 0, y: 0, width: width, height: height))
        view.layer.borderWidth = 1.0
        view.layer.borderColor = UIColor.lightGray.cgColor
      
      
        return view
    }()
}
