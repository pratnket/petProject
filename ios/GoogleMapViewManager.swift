import UIKit
import GoogleMaps
import React

@objc(GoogleMapViewManager)
class GoogleMapViewManager: RCTViewManager {
    
    override func view() -> UIView! {
        return GoogleMapView()
    }
    
    override static func requiresMainQueueSetup() -> Bool {
        return true
    }
    
    // 導出屬性
    @objc func setUseCurrentLocation(_ view: GoogleMapView, useCurrentLocation: Bool) {
        view.useCurrentLocation = useCurrentLocation
        if useCurrentLocation {
            view.requestLocation()
        }
    }
    
    // 導出事件
    @objc func setOnMapPress(_ view: GoogleMapView, onMapPress: @escaping RCTBubblingEventBlock) {
        view.onMapPress = onMapPress
    }
    
    @objc func setOnMarkerPress(_ view: GoogleMapView, onMarkerPress: @escaping RCTBubblingEventBlock) {
        view.onMarkerPress = onMarkerPress
    }
    
    @objc func setOnLocationUpdate(_ view: GoogleMapView, onLocationUpdate: @escaping RCTBubblingEventBlock) {
        view.onLocationUpdate = onLocationUpdate
    }
}
