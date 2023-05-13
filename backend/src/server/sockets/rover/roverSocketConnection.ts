#!/usr/bin/env node

// Connecting to ROS
import ROSLIB from 'roslib';
// import type { IRosTypeSensorMsgsNavSatFix } from './rover_interfaces';

const ros = new ROSLIB.Ros({
  url: 'ws://192.168.0.105:9090',
});

ros.on('connection', function () {
  console.log('Connected to websocket server.');
});

ros.on('error', function (error) {
  console.log('Error connecting to websocket server: ', error);
});

ros.on('close', function () {
  console.log('Connection to websocket server closed.');
});

// Publishing a Topic
// ------------------

const cmdVel = new ROSLIB.Topic({
  ros: ros,
  name: '/cmd_vel',
  messageType: 'geometry_msgs/Twist',
});

const twist = new ROSLIB.Message({
  lat: 0,
  lon: 0,
});

console.log('Publishing cmd_vel');
cmdVel.publish(twist);
