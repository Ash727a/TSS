function simulationStepUIA(dt: any, uiaControls: { depress_pump?: any; O2_vent?: any }, uiaOldSimState: any): any {
  // const battery_capacity = batteryStep(dt, controls, oldSimState).battery_capacity
  // const battery_time_left = batteryStep(dt, controls, oldSimState).battery_time_left
  // const battery_output = batteryStep(dt, controls, oldSimState).battery_output
  //const emu1 = emuOnOff(dt, uiaControls, uiaOldSimState).onOff1
  //const emu2 = emuOnOff(dt, uiaControls, uiaOldSimState).onOff2
  //if (uiaControls.emu_on_off === true)

  return {
    emu1: emu1OnOff(dt, uiaControls, uiaOldSimState).emu1_is_booted,
    emu2: emu2OnOff(dt, uiaControls, uiaOldSimState),
    o2_supply_pressure1: o2SupplyPressure(dt, uiaControls, uiaOldSimState).o2_pressure1,
    o2_supply_pressure2: o2SupplyPressure(dt, uiaControls, uiaOldSimState).o2_pressure2,
    oxygen_supp_out1: o2SupplyPressure(dt, uiaControls, uiaOldSimState).o2_pressure_out1,
    oxygen_supp_out2: o2SupplyPressure(dt, uiaControls, uiaOldSimState).o2_pressure_out2,
    ev1_supply: supplyWaterStatus(dt, uiaControls, uiaOldSimState).water1,
    ev2_supply: supplyWaterStatus(dt, uiaControls, uiaOldSimState).water2,
    ev1_waste: wasteWater(dt, uiaControls, uiaOldSimState).waste_water1,
    ev2_waste: wasteWater(dt, uiaControls, uiaOldSimState).waste_water2,
    emu1_O2: oxygen(dt, uiaControls, uiaOldSimState).oxygen_status1,
    emu2_O2: oxygen(dt, uiaControls, uiaOldSimState).oxygen_status2,
    depress_pump: dPump(dt, uiaControls, uiaOldSimState),
    O2_vent: o2Vent(dt, uiaControls, uiaOldSimState),
    airlock_pressure: airlockPressure(dt, uiaControls, uiaOldSimState),

    //airlock supply water emu1 
  };
}
/*
function emuOnOff(dt, uiaControls, uiaOldSimState) {
  let emu1 = uiaControls.emu1
  let emu2 = uiaControls.emu2
  let onOff1 = uiaOldSimState.onOff1
  let onOff2 = uiaOldSimState.onOff2
	
  if (emu1 == true){
    onOff1 = 'ON'
  }
  else {
    onOff1 = 'OFF'
  }
  if (emu2 == true){
    onOff2 = 'ON'
  }
  else {
    onOff2 = 'OFF'
  }
  return {onOff1, onOff2}
}
*/
function emu1OnOff(dt: any, uiaControls: any, uiaOldSimState: { onOff1: any }): any {
  const emu1 = uiaControls.emu1;
  let onOff1 = uiaOldSimState.onOff1;

  if (emu1 == true) {
    setTimeout(() => {  console.log("World!"); }, 5000);
    onOff1 = 'ON';
  } else {
    onOff1 = 'OFF';
  }
  // console.log(onOff1);
  return onOff1;
}
function emu2OnOff(dt: any, uiaControls: any, uiaOldSimState: { onOff2: any }): any {
  const emu2 = uiaControls.emu2;
  let onOff2 = uiaOldSimState.onOff2;

  if (emu2 == true) {
    onOff2 = 'ON';
  } else {
    onOff2 = 'OFF';
  }
  return onOff2;
}
function o2SupplyPressure(
  dt: number,
  uiaControls: any,
  uiaOldSimState: { o2_supply_pressure1: any; o2_supply_pressure2: any }
): any {
  const oxygen_fillRate = 3500 / (0.5 * 60); //(oz/s)
  const amountFilled = oxygen_fillRate * (dt / 1000);
  const max_o2_psi = 3500;
  let o2_pressure1 = uiaOldSimState.o2_supply_pressure1;
  let o2_pressure2 = uiaOldSimState.o2_supply_pressure2;

  if (o2_pressure1 < max_o2_psi && uiaControls.emu1_O2 === true && uiaControls.O2_vent === false)
    o2_pressure1 = o2_pressure1 + amountFilled;
  else if (uiaControls.emu1_O2 === false && uiaControls.O2_vent === true) {
    o2_pressure1 -= oxygen_fillRate;
    if (o2_pressure1 <= 21) o2_pressure1 = 21;
  } else if (o2_pressure2 < max_o2_psi && uiaControls.emu2_O2 === true && uiaControls.O2_vent === false)
    o2_pressure2 = o2_pressure2 + amountFilled;
  else if (uiaControls.emu2_O2 === false && uiaControls.O2_vent === true) {
    o2_pressure2 -= oxygen_fillRate;
    if (o2_pressure2 <= 21) o2_pressure2 = 21;
  }

  const o2_pressure_out1 = Math.floor(o2_pressure1);
  const o2_pressure_out2 = Math.floor(o2_pressure2);

  return { o2_pressure1, o2_pressure2, o2_pressure_out1, o2_pressure_out2 };
}
//********supplyWater FUNCTION CAN BE IMPLEMENTED TO SIMULATE SUPPLY WATER FILL***************

// function supplyWater(dt, uiaControls, uiaOldSimState) {
// 	const water_fillRate =  100 / ( 2.5 * 60) //(oz/s)
// 	const amountFilled = water_fillRate * (dt / 1000)
// 	let water_supply1 = uiaOldSimState.ev1_supply
// 	let water_supply2 = uiaOldSimState.ev2_supply
// 	let supply1 = uiaControls.ev1_supply
// 	let supply2 = uiaControls.ev2_supply

// 	//EV1 Supply
// 	if (supply1 === true && water_supply1 < 100){
// 		water_supply1 = uiaOldSimState.water_supply + amountFilled
// 	}
// 	else if(water_supply1 >= 100)
// 		water_supply1 = 100
// 	else
// 		water_supply1 = 0

// 	//EV2 Supply
// 	if (supply2 === true && water_supply2 < 100){
// 		water_supply2 = uiaOldSimState.water_supply + amountFilled
// 	}
// 	else if(water_supply2 >= 100)
// 		water_supply2 = 100
// 	else
// 		water_supply2 = 0

// 	return {water_supply1, water_supply2}
// }
//********************************************************************************

function supplyWaterStatus(dt: any, uiaControls: any, uiaOldSimState: { ev1_supply: any; ev2_supply: any }): any {
  let water1 = uiaOldSimState.ev1_supply;
  let water2 = uiaOldSimState.ev2_supply;
  const status1 = uiaControls.ev1_supply;
  const status2 = uiaControls.ev2_supply;

  //EV1 Waste
  if (status1) water1 = 'OPEN';
  else water1 = 'CLOSE';
  //EV2 Waste
  if (status2) water2 = 'OPEN';
  else water2 = 'CLOSE';

  // console.log(water2)

  return { water1, water2 };
}

function wasteWater(dt: any, uiaControls: any, uiaOldSimState: { ev1_waste: any; ev2_waste: any }): any {
  let waste_water1 = uiaOldSimState.ev1_waste;
  let waste_water2 = uiaOldSimState.ev2_waste;
  const waste1 = uiaControls.ev1_waste;
  const waste2 = uiaControls.ev2_waste;

  //EV1 Waste
  if (waste1) waste_water1 = 'OPEN';
  else waste_water1 = 'CLOSE';
  //EV2 Waste
  if (waste2) waste_water2 = 'OPEN';
  else waste_water2 = 'CLOSE';

  return { waste_water1, waste_water2 };
}

function oxygen(dt: any, uiaControls: any, uiaOldSimState: { emu1_O2: any; emu2_O2: any }): any {
  let oxygen_status1 = uiaOldSimState.emu1_O2;
  let oxygen_status2 = uiaOldSimState.emu2_O2;
  const o2_1 = uiaControls.emu1_O2;
  const o2_2 = uiaControls.emu2_O2;

  if (o2_1) oxygen_status1 = 'OPEN';
  else oxygen_status1 = 'CLOSE';

  if (o2_2) oxygen_status2 = 'OPEN';
  else oxygen_status2 = 'CLOSE';

  return { oxygen_status1, oxygen_status2 };
}
function dPump(dt: any, { depress_pump }: any, uiaOldSimState: { depress_pump: any }): any {
  let pumpState = uiaOldSimState.depress_pump;
  if (depress_pump) pumpState = 'ENABLE';
  else pumpState = 'FAULT';
  return pumpState;
}

function o2Vent(dt: any, { O2_vent }: any, uiaOldSimState: { O2_vent: any }): any {
  let vent = uiaOldSimState.O2_vent;
  if (O2_vent) vent = 'VENT';
  else vent = 'CLOSE';
  return vent;
}

function airlockPressure(
  dt: number,
  uiaControls: any,
  uiaOldSimState: { airlock_pressure: any; }
): any {
  const airlcok_fill_rate = 3500 / (0.5 * 60); //(oz/s)
  const amountFilled = airlcok_fill_rate * (dt / 1000);
  const max_o2_psi = 3500;
  let airlock = uiaOldSimState.airlock_pressure;


  if (airlock < max_o2_psi && uiaControls.emu1_O2 === true && uiaControls.O2_vent === false)
    airlock = airlock + amountFilled;

  if (uiaControls.depress_pump === true) {
    airlock -= airlcok_fill_rate;
    if (airlock > 10) airlock = 10.3;

  //const o2_pressure_out1 = Math.floor(airlock);


  return { airlock };
}
