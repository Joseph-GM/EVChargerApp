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
    var polylines : [TMapPolyline] = []

    let apiKey:String = "SK_API_KEY"

  @objc var clatitude: NSNumber = 37.646556
  @objc var clongitude: NSNumber = 126.876829
  @objc var markerdata: NSArray?
  @objc var dlatitude : NSNumber?
  @objc var dlongitude : NSNumber?
  @objc var routedata: NSArray?
  
  var mPosition: CLLocationCoordinate2D {
    get {
      return CLLocationCoordinate2DMake(Double(self.clatitude), Double(self.clongitude))
    }
  }

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
        
//          setupView()
    }
    
  public func mapViewDidFinishLoadingMap() {
    print("In Map current position *******************************")
    print(mPosition)
    
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
    
  
  if let poiResult = markerdata as? [[String : AnyObject]] {
    for poi in poiResult {
      let markerLatitude:Double? = Double(poi["noorLat"] as! Substring)
      let markerLongitude:Double? = Double(poi["noorLon"] as! Substring)
      let markerPosition: CLLocationCoordinate2D? = CLLocationCoordinate2D(latitude: markerLatitude!, longitude: markerLongitude!)
      let marker = TMapMarker(position: markerPosition!)
      marker.map = self.mapView
      marker.title = String(poi["name"] as! Substring)
      self.markers.append(marker)
      self.mapView?.fitMapBoundsWithMarkers(self.markers)
    }
  }
    if let dlat = dlatitude {
      if let dlon = dlongitude {
        let dPosition: CLLocationCoordinate2D = CLLocationCoordinate2D(latitude: dlat.doubleValue, longitude: dlon.doubleValue)
        if let routes = routedata as? [[Double]] {
          var path = Array<CLLocationCoordinate2D>()
          for temp in routes {
            let pathLatitude:Double = temp[1] as! Double
            let pathLongitude:Double = temp[0] as! Double
            path.append(CLLocationCoordinate2D(latitude:pathLatitude, longitude: pathLongitude))
          }
          let polyline = TMapPolyline(coordinates: path)
          polyline.map = mapView
        }
        let marker1 = TMapMarker(position: self.mPosition)
                marker1.map = self.mapView
                marker1.title = "출발지"
                self.markers.append(marker1)

                let marker2 = TMapMarker(position: dPosition)
                marker2.map = self.mapView
                marker2.title = "목적지"
                self.markers.append(marker2)
      }
    }
    

/*    if let dlat = dlatitude  {
      if let dlon = dlongitude {
        let dPosition: CLLocationCoordinate2D = CLLocationCoordinate2D(latitude: dlat.doubleValue, longitude: dlon.doubleValue)
        let pathData = TMapPathData()
        pathData.findPathData(startPoint: self.mPosition, endPoint: dPosition){(result, error) -> Void in
          if let polyline = result{
            DispatchQueue.main.async {
              let marker1 = TMapMarker(position: self.mPosition)
                      marker1.map = self.mapView
                      marker1.title = "출발지"
                      self.markers.append(marker1)

                      let marker2 = TMapMarker(position: dPosition)
                      marker2.map = self.mapView
                      marker2.title = "목적지"
                      self.markers.append(marker2)

                      polyline.map = self.mapView
                      self.polylines.append(polyline)
                      self.mapView?.fitMapBoundsWithPolylines(self.polylines)
            }
          }
          }
        }
          
      }*/
    
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
        let height = bounds.height*0.65
      
        let view = UIView(frame: CGRect(x: 0, y: 0, width: width, height: height))
        view.layer.borderWidth = 1.0
        view.layer.borderColor = UIColor.lightGray.cgColor
      
      
        return view
    }()
}
