import React, { useState, useEffect } from 'react';
import ROSLIB from 'roslib';

const  JointMotor = ({ ros, namespace, name, canId}) => {
  const [status, setStatus] = useState(null);
  const [haltPub, setHaltPub] = useState(null);
  const [resetPub, setResetPub] = useState(null);

  useEffect(() => {
    if (!ros) {
      return;
    }

    const topic = new ROSLIB.Topic({
      ros: ros,
      name: '/elevation_joint_motor_status',
      messageType: 'elevation_platform_msgs/msg/JointMotorStatus',
    });

    topic.subscribe((msg) => {
      if (msg.can_id != canId)
        return;

      status.currentDegree        = msg.current_degree;
      status.mode                 = msg.operation_mode;
      status.current              = msg.current;
      status.targetCurrent        = msg.target_current;
      status.velocity             = msg.velocity;
      status.targetVelocity       = msg.target_velocity;
      status.position             = msg.position;
      status.targetPosition       = msg.target_position;

      setStatus(status);
      // rpdo.unsubscribe();
    })

    return () => {
      rpdo.unsubscribe();
    };
  }, []);

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
  }, [ros]);

  useEffect(() => {
    if (!ros) {
      return;
    }

    const topic = new ROSLIB.Topic({
      ros: ros,
      name: '/' + namespace + '/reset',
      messageType: 'std_msgs/msg/Empty',
    });

    setResetPub(topic);

    return () => {
      topic.unadvertise();
      setHaltPub(null);
    };
  }, [ros]);
  
  const sendHalt = (() => {
    const msg = ROSLIB.Message({});
    haltPub.publish(msg)
  })

  const sendClear = (() => {
    const msg = ROSLIB.Message({});
    resetPub.publish(msg)
  })

  return (
    <div className='outContainer'>
      <h3>{name}:</h3>
      <div className="borderContainer">
        <table>
          <tbody>
            <tr>
              <td>
                <div className="borderContainer">
                  <h4>current_degree : {status.currentDegree} </h4>
                </div>
              </td>
            </tr>
            <tr>
              <td style={{ display: "flex" }}>
                <div className="btn" onClick={() => sendHalt()}>Halt</div>
                <div className="btn" onClick={() => sendClear()}>Clear</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default JointMotor;