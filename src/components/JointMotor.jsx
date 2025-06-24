import React, { useState, useEffect } from 'react';
import ROSLIB from 'roslib';


const  JointMotor = ({ ros, namespace, name, canId}) => {
  const [status, setStatus] = useState({
    canId: 0,
    isDisconnected: true,
    gearRatio: 0.0,
    currentDegree: 0.0,
    mode: 0,
    current: 0,
    targetCurrent: 0,
    velocity: 0.0,
    targetVelocity: 0.0,
    position: 0,
    targetPosition: 0,
    errorStatus: 0,
    busVoltage: 0.0,
    motorTemp: 0.0,
    boardTemp: 0.0,
    encoderVoltage: 0.0,
    encoderStatus: 0.0,
    maxForwardVelocity: 0.0,
    minBackwardVelocity: 0.0,
    maxForwardPosition: 0.0,
    minBackwardPosition: 0.0,
    maxForwardCurrent: 0.0,
    minBackwardCurrent: 0.0,
    positionP: 0,
    positionI: 0,
    positionD: 0,
    velocityP: 0,
    velocityI: 0,
    velocityD: 0,
    currentP: 0,
    currentI: 0,
    currentD: 0,
  });
  const [haltPub, setHaltPub] = useState(null);
  const [clearPub, setClearPub] = useState(null);
  const [rotDegPub, setRotDegPub] = useState(null);

  useEffect(() => {
    if (!ros) {
      return;
    }

    const statusTopic = new ROSLIB.Topic({
      ros: ros,
      name: '/elevation_joint_motor_status',
      messageType: 'elevation_platform_msgs/msg/JointMotorStatus',
    });

    statusTopic.subscribe((msg) => {      
      if (msg.can_id != canId)
        return;
      
      console.log(msg);
      
      setStatus((prevStatus) => ({
        ...prevStatus,
        canId: msg.can_id,
        isDisconnected: msg.is_disconnected,
        gearRatio: msg.gear_ratio,
        currentDegree: msg.current_degree,
        mode: msg.mode,
        current: msg.current,
        targetCurrent: msg.target_current,
        velocity: msg.velocity,
        targetVelocity: msg.target_velocity,
        position: msg.position,
        targetPosition: msg.target_position,
        errorStatus: msg.error_status,
        busVoltage: msg.bus_voltage,
        motorTemp: msg.motor_temp,
        boardTemp: msg.board_temp,
        encoderVoltage: msg.encoder_voltage,
        encoderStatus: msg.encoder_status,
        maxForwardVelocity: msg.max_forward_velocity,
        minBackwardVelocity: msg.min_backward_velocity,
        maxForwardPosition: msg.max_forward_position,
        minBackwardPosition: msg.min_backward_position,
        maxForwardCurrent: msg.max_forward_current,
        minBackwardCurrent: msg.min_backward_current,
        positionP: msg.position_p,
        positionI: msg.position_i,
        positionD: msg.position_d,
        velocityP: msg.velocity_p,
        velocityI: msg.velocity_i,
        velocityD: msg.velocity_d,
        currentP: msg.current_p,
        currentI: msg.current_i,
        currentD: msg.current_d,
      }));
    })

    return () => {
      statusTopic.unsubscribe();
    };
  }, [ros, canId]);

  useEffect(() => {
    if (!ros) {
      return;
    }

    const topic = new ROSLIB.Topic({
      ros: ros,
      name: '/' + namespace + '/halt',
      messageType: 'std_msgs/msg/Empty',
    });

    setHaltPub(topic);

    return () => {
      topic.unadvertise();
      setHaltPub(null);
    };
  }, [ros, namespace]);

  useEffect(() => {
    if (!ros) {
      return;
    }

    const topic = new ROSLIB.Topic({
      ros: ros,
      name: '/' + namespace + '/clear',
      messageType: 'std_msgs/msg/Empty',
    });

    setClearPub(topic);

    return () => {
      topic.unadvertise();
      setClearPub(null);
    };
  }, [ros, namespace]);

  useEffect(() => {
    if (!ros) {
      return;
    }

    const topic = new ROSLIB.Topic({
      ros: ros,
      name: '/' + namespace + '/rotate_in_degree',
      messageType: 'std_msgs/msg/Float32',
    });

    setRotDegPub(topic);

    return () => {
      topic.unadvertise();
      setRotDegPub(null);
    };
  }, [ros, namespace]);

  const sendHalt = () => {
    if (haltPub) {
      console.log('Publishing halt message');
      const msg = new ROSLIB.Message({});
      haltPub.publish(msg);
    } else {
      console.warn('Halt publisher not initialized');
    }
  };

  const sendClear = () => {
    if (clearPub) {
      console.log('Publishing clear message');
      const msg = new ROSLIB.Message({});
      clearPub.publish(msg);
    } else {
      console.warn('Clear publisher not initialized');
    }
  };

  const sendRotDeg = (deg) => {
    if (rotDegPub) {
      console.log('Publishing rotate degree message');
      const msg = new ROSLIB.Message({
        data: deg
      });
      rotDegPub.publish(msg);
    } else {
      console.warn('Rotate degree publisher not initialized');
    }
  };

  return (
    <div className='outContainer'>
      <h3>{name}:</h3>
      <div className="borderContainer">
        <table>
          <tbody>
            <tr>
              <td>
                <div className="borderContainer">
                  <h5>Current Degree: {status.currentDegree.toFixed(2)} deg</h5>
                  <h5>Mode: {status.mode}</h5>
                  <h5>Current: {status.current} mA</h5>
                  <h5>Target Current: {status.targetCurrent} mA</h5>
                  <h5>Velocity: {status.velocity.toFixed(2)} deg/s</h5>
                  <h5>Target Velocity: {status.targetVelocity.toFixed(2)} deg/s</h5>
                  <h5>Position: {`0x${Math.floor(status.position).toString(16).toUpperCase()}`}</h5>
                  <h5>Target Position: {`0x${Math.floor(status.minBackwardPosition).toString(16).toUpperCase()}`}</h5>
                  <h5>Error Status: {status.errorStatus}</h5>
                  <h5>Bus Voltage: {status.busVoltage} V</h5>
                  <h5>Motor Temperature: {status.motorTemp} C</h5>
                  <h5>Board Temperature: {status.boardTemp} C</h5>
                  <h5>Encoder Voltage: {status.encoderVoltage} V</h5>
                  <h5>Encoder Status: {status.encoderStatus}</h5>
                  <h5>Max Forward Velocity: {status.maxForwardVelocity.toFixed(2)} deg/s</h5>
                  <h5>Min Backward Velocity: {status.minBackwardVelocity.toFixed(2)} deg/s</h5>
                  <h5>Max Forward Position: {`0x${Math.floor(status.maxForwardPosition).toString(16).toUpperCase()}`}</h5>
                  <h5>Min Backward Position: {`0x${Math.floor(status.minBackwardPosition).toString(16).toUpperCase()}`}</h5>
                  <h5>Max Forward Current: {status.maxForwardCurrent} mA</h5>
                  <h5>Min Backward Current: {status.minBackwardCurrent} mA</h5>
                  <h5>Position P: {status.positionP}</h5>
                  <h5>Position I: {status.positionI}</h5>
                  <h5>Position D: {status.positionD}</h5>
                  <h5>Velocity P: {status.velocityP}</h5>
                  <h5>Velocity I: {status.velocityI}</h5>
                  <h5>Velocity D: {status.velocityD}</h5>
                  <h5>Current P: {status.currentP}</h5>
                  <h5>Current I: {status.currentI}</h5>
                  <h5>Current D: {status.currentD}</h5>
                </div>
              </td>
            </tr>
            <tr>
              <td style={{ display: "flex" }}>
                <div className="btn" onClick={() => sendHalt()}>Halt</div>
                <div className="btn" onClick={() => sendClear()}>Clear</div>
              </td>
            </tr>
            <tr>
              <td style={{ display: "flex" }}>
                <div className="btn" onClick={() => sendRotDeg(1.0)}>+1</div>
                <div className="btn" onClick={() => sendRotDeg(2.0)}>+2</div>
                <div className="btn" onClick={() => sendRotDeg(5.0)}>+5</div>
                <div className="btn" onClick={() => sendRotDeg(10.0)}>+10</div>
                <div className="btn" onClick={() => sendRotDeg(20.0)}>+20</div>
                <div className="btn" onClick={() => sendRotDeg(45.0)}>+45</div>
              </td>
            </tr>
            <tr>
              <td style={{ display: "flex" }}>
                <div className="btn" onClick={() => sendRotDeg(-1.0)}>-1</div>
                <div className="btn" onClick={() => sendRotDeg(-2.0)}>-2</div>
                <div className="btn" onClick={() => sendRotDeg(-5.0)}>-5</div>
                <div className="btn" onClick={() => sendRotDeg(-10.0)}>-10</div>
                <div className="btn" onClick={() => sendRotDeg(-20.0)}>-20</div>
                <div className="btn" onClick={() => sendRotDeg(-45.0)}>-45</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default JointMotor;