import UIKit
import GoogleMaps
import CoreLocation
import React

@objc(GoogleMapView)
class GoogleMapView: UIView, CLLocationManagerDelegate {
    private var mapView: GMSMapView!
    private var locationManager: CLLocationManager!
    private var currentLocation: CLLocation?
    
    @objc var onMapPress: RCTBubblingEventBlock?
    @objc var onMarkerPress: RCTBubblingEventBlock?
    @objc var onLocationUpdate: RCTBubblingEventBlock?
    @objc var useCurrentLocation: Bool = false
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        setupMap()
        setupLocationManager()
    }
    
    required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupMap()
        setupLocationManager()
    }
    
    private func setupMap() {
        // 設定地圖
        let camera = GMSCameraPosition.camera(
            withLatitude: 25.0330,
            longitude: 121.5654,
            zoom: 15
        )
        
        mapView = GMSMapView.map(withFrame: bounds, camera: camera)
        mapView.delegate = self
        mapView.isMyLocationEnabled = true
        mapView.settings.myLocationButton = true
        
        addSubview(mapView)
        
        // 設定自動佈局
        mapView.translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate([
            mapView.topAnchor.constraint(equalTo: topAnchor),
            mapView.leadingAnchor.constraint(equalTo: leadingAnchor),
            mapView.trailingAnchor.constraint(equalTo: trailingAnchor),
            mapView.bottomAnchor.constraint(equalTo: bottomAnchor)
        ])
    }
    
    private func setupLocationManager() {
        locationManager = CLLocationManager()
        locationManager.delegate = self
        locationManager.desiredAccuracy = kCLLocationAccuracyBest
        locationManager.requestWhenInUseAuthorization()
    }
    
    func requestLocation() {
        if CLLocationManager.locationServicesEnabled() {
            locationManager.requestLocation()
        }
    }
    
    // MARK: - CLLocationManagerDelegate
    
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        guard let location = locations.last else { return }
        
        currentLocation = location
        let camera = GMSCameraPosition.camera(
            withLatitude: location.coordinate.latitude,
            longitude: location.coordinate.longitude,
            zoom: 15
        )
        
        mapView.animate(to: camera)
        
        // 發送位置更新事件
        if let onLocationUpdate = onLocationUpdate {
            onLocationUpdate([
                "latitude": location.coordinate.latitude,
                "longitude": location.coordinate.longitude
            ])
        }
    }
    
    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        print("Location error: \(error.localizedDescription)")
    }
    
    func locationManager(_ manager: CLLocationManager, didChangeAuthorization status: CLAuthorizationStatus) {
        switch status {
        case .authorizedWhenInUse, .authorizedAlways:
            if useCurrentLocation {
                requestLocation()
            }
        case .denied, .restricted:
            print("Location access denied")
        case .notDetermined:
            locationManager.requestWhenInUseAuthorization()
        @unknown default:
            break
        }
    }
}

// MARK: - GMSMapViewDelegate

extension GoogleMapView: GMSMapViewDelegate {
    func mapView(_ mapView: GMSMapView, didTapAt coordinate: CLLocationCoordinate2D) {
        if let onMapPress = onMapPress {
            onMapPress([
                "latitude": coordinate.latitude,
                "longitude": coordinate.longitude
            ])
        }
    }
    
    func mapView(_ mapView: GMSMapView, didTap marker: GMSMarker) -> Bool {
        if let onMarkerPress = onMarkerPress {
            onMarkerPress([
                "latitude": marker.position.latitude,
                "longitude": marker.position.longitude,
                "title": marker.title ?? "",
                "description": marker.snippet ?? ""
            ])
        }
        return true
    }
}
