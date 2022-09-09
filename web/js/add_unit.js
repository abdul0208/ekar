// svc = core / create_unit
// params = { "creatorId": 15302, "name": "EKAR Test Unit", "hwTypeId": "62", "dataFlags": 1 }

// params = { "params": [{ "svc": "item/update_custom_property", "params": { "itemId": 81, "name": "used_hw", "value": "{\"7\":0,\"11\":0,\"24\":0,\"27\":0,\"31\":0,\"37\":0,\"52\":1,\"53\":0,\"59\":1,\"61\":0,\"62\":2,\"66\":0,\"366\":0,\"2162\":0,\"6428\":1,\"7526\":0,\"7900\":1,\"7902\":0,\"7968\":1,\"7971\":1,\"13592\":1}" } }, { "svc": "unit/update_device_type", "params": { "itemId": 15300, "deviceTypeId": "62", "uniqueId": "1234560000" } }, { "svc": "unit/update_unique_id2", "params": { "itemId": 15300, "uniqueId2": "" } }, { "svc": "unit/update_access_password", "params": { "itemId": 15300, "accessPassword": "" } }, { "svc": "unit/update_phone", "params": { "itemId": 15300, "phoneNumber": "" } }, { "svc": "unit/update_phone2", "params": { "itemId": 15300, "phoneNumber": "" } }, { "svc": "unit/update_mileage_counter", "params": { "itemId": 15300, "newValue": 0 } }, { "svc": "unit/update_eh_counter", "params": { "itemId": 15300, "newValue": 0 } }, { "svc": "unit/update_traffic_counter", "params": { "itemId": 15300, "newValue": 0, "regReset": 0 } }, { "svc": "unit/update_calc_flags", "params": { "itemId": 15300, "newValue": 16 } }, { "svc": "unit/update_hw_params", "params": { "itemId": 15300, "hwId": "62", "params_data": { "reset_all": 1, "params": [], "full_data": 0 }, "action": "set" } }], "flags": 0 }



function AddTestUnit() {
    exec('core/create_unit', { "creatorId": 15302, "name": "EKAR Test Unit", "hwTypeId": "62", "dataFlags": 1 }, function (d) {
        var itemId = d.item.id
        console.log(itemId, d.item.nm)
        var batch = [
            { "svc": "unit/update_device_type", "params": { "itemId": itemId, "deviceTypeId": "62", "uniqueId": "1234560000" } },
            { "svc": "unit/update_unique_id2", "params": { "itemId": itemId, "uniqueId2": "" } },
            { "svc": "unit/update_access_password", "params": { "itemId": itemId, "accessPassword": "" } },
            { "svc": "unit/update_phone", "params": { "itemId": itemId, "phoneNumber": "" } },
            { "svc": "unit/update_phone2", "params": { "itemId": itemId, "phoneNumber": "" } },
            { "svc": "unit/update_mileage_counter", "params": { "itemId": itemId, "newValue": 0 } },
            { "svc": "unit/update_eh_counter", "params": { "itemId": itemId, "newValue": 0 } },
            { "svc": "unit/update_traffic_counter", "params": { "itemId": itemId, "newValue": 0, "regReset": 0 } },
            { "svc": "unit/update_calc_flags", "params": { "itemId": itemId, "newValue": 16 } },
            { "svc": "unit/update_hw_params", "params": { "itemId": itemId, "hwId": "62", "params_data": { "reset_all": 1, "params": [], "full_data": 0 }, "action": "set" } },

            { "svc": "unit/update_fuel_rates_params", "params": { "itemId": itemId, "idlingSummer": 0, "idlingWinter": 0, "consSummer": 10, "consWinter": 12, "winterMonthFrom": 11, "winterDayFrom": 1, "winterMonthTo": 1, "winterDayTo": 29 } },
            { "svc": "unit/update_sensor", "params": { "n": "Ignition", "t": "engine operation", "d": "", "m": "On/Off", "p": "io_1", "f": 0, "c": "{\"appear_in_popup\":true,\"show_time\":false,\"pos\":1,\"cm\":1,\"validate_driver_unbound\":0,\"unbound_code\":\"\",\"mu\":\"0\",\"act\":1,\"uct\":0,\"timeout\":0,\"ci\":{},\"consumption\":0}", "vt": 1, "vs": 0, "tbl": [], "id": 0, "itemId": itemId, "callMode": "create" } },
            { "svc": "unit/update_trip_detector", "params": { "itemId": itemId, "type": 3, "gpsCorrection": true, "minSat": 2, "minMovingSpeed": 1, "minStayTime": 300, "maxMessagesDistance": 10000, "minTripTime": 60, "minTripDistance": 100 } }
        ]

        exec('core/batch', batch, function (d) {
            console.log(d)
        })
    })

}