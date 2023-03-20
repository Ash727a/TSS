import { Component, Input, SimpleChanges } from '@angular/core';
import { TelemetryData, ValueSensor } from '@app/core/interfaces';

@Component({
  selector: 'app-telemetry-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.scss'],
})
export class StateComponent {
  private static readonly EMPTY_TEXT_LABEL = '';
  @Input() public variant: 'default' | 'small' = 'default';
  @Input() public telemetryData: TelemetryData = {} as TelemetryData;

  protected sensors1: ValueSensor[] = [];
  protected sensors2: ValueSensor[] = [];

  constructor() {
    this.mapTelemetryDataToTable();
  }
  /** MODEL: simulationState
   * This is the model for the simulation state.
   * @column room_id: Room ID (PK)
   * @column is_running: Is the simulation running?
   * @column is_paused: Is the simulation paused?
   * @column time: Current simulation time
   * @column timer: Current simulation timer
   * @column started_at: Current simulation start time
   * @column primary_oxygen: Oxygen primary
   * @column secondary_oxygen: Oxygen secondary
   * @column suit_pressure: Suit pressure
   * @column sub_pressure: Sub pressure
   * @column o2_pressure: O2 pressure
   * @column o2_rate: O2 rate
   * @column h2o_gas_pressure: H2O gas pressure
   * @column h2o_liquid_pressure: H2O liquid pressure
   * @column sop_pressure: SOP pressure
   * @column sop_rate: SOP rate
   * @column heart_rate: Heart rate
   * @column fan_tachometer: Fan tachometer
   * @column battery_capacity: Battery capacity
   * @column temperature: Temperature
   * @column battery_time_left: Battery time left
   * @column o2_time_left: O2 time left
   * @column h2o_time_left: H2O time left
   * @column battery_percentage: Battery percentage
   * @column battery_outputput: Battery output
   * @column oxygen_primary_time: Oxygen primary time
   * @column oxygen_secondary_time: Oxygen secondary time
   * @column water_capacity: Water capacity
   */
  private mapTelemetryDataToTable() {
    this.sensors1 = [
      { name: 'Primary Oxygen', value: this.translateDataToDisplayString(this.telemetryData?.primary_oxygen, '%') },
      { name: 'Secondary Oxygen', value: this.translateDataToDisplayString(this.telemetryData?.secondary_oxygen, '%') },
      { name: 'Suit Pressure', value: this.translateDataToDisplayString(this.telemetryData?.suit_pressure, 'psia') },
      { name: 'Sub Pressure', value: this.translateDataToDisplayString(this.telemetryData?.sub_pressure, 'psia') },
      { name: 'O2 Pressure', value: this.translateDataToDisplayString(this.telemetryData?.o2_pressure, 'psia') },
      { name: 'O2 Rate', value: this.translateDataToDisplayString(this.telemetryData?.o2_rate, 'psi/min') },
      { name: 'H2O Gas Pressure', value: this.translateDataToDisplayString(this.telemetryData?.h2o_gas_pressure, 'psia') },
      { name: 'H2O Liquid Pressure', value: this.translateDataToDisplayString(this.telemetryData?.h2o_liquid_pressure, 'psia') },
      { name: 'SOP Pressure', value: this.translateDataToDisplayString(this.telemetryData?.sop_pressure, 'psia') },
      { name: 'SOP Rate', value: this.translateDataToDisplayString(this.telemetryData?.sop_rate, 'psi/min') },
    ];

    this.sensors2 = [
      { name: 'EVA Time', value: this.translateDataToDisplayString(this.telemetryData?.timer, '') },
      { name: 'Heart Rate', value: this.translateDataToDisplayString(this.telemetryData?.heart_rate, 'bpm') },
      { name: 'Fan Tachometer', value: this.translateDataToDisplayString(this.telemetryData?.fan_tachometer, 'rpm') },
      { name: 'Battery Capacity', value: this.translateDataToDisplayString(this.telemetryData?.battery_capacity, 'amp-hr') },
      { name: 'Temperature', value: this.translateDataToDisplayString(this.telemetryData?.temperature, 'deg F') },
      { name: 'Battery Time Left', value: this.translateDataToDisplayString(this.telemetryData?.battery_time_left, '') },
      { name: 'O2 Time Left', value: this.translateDataToDisplayString(this.telemetryData?.o2_time_left, '') },
      { name: 'H2O Time Left', value: this.translateDataToDisplayString(this.telemetryData?.h2o_time_left, '') },
    ];

    // Even out the rows for each table (fill with blank space until both are equal)
    if (this.sensors1.length > this.sensors2.length) {
      while (this.sensors1.length > this.sensors2.length) {
        this.sensors2.push({ name: '', value: StateComponent.EMPTY_TEXT_LABEL });
      }
    } else {
      while (this.sensors2.length > this.sensors1.length) {
        this.sensors1.push({ name: '', value: StateComponent.EMPTY_TEXT_LABEL });
      }
    }
  }

  private translateDataToDisplayString(data: any, metricSuffix: string = '') {
    return data ? `${data} ${metricSuffix}` : StateComponent.EMPTY_TEXT_LABEL;
  }

  // Detects when the telemetry data changes
  ngOnChanges(changes: SimpleChanges) {
    this.telemetryData = changes['telemetryData'].currentValue as TelemetryData;
    this.mapTelemetryDataToTable();
  }
}
