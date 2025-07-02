import { useState } from 'react'

import ROSLIB from 'roslib';

import Rosconnection from './components/RosConnection';
import JointMotor from './components/JointMotor';

import './css/App.css'

function App() {
  const [ros, setRos] = useState(null);

  return (
    <>
      <Rosconnection rosUrl="ws://192.168.7.148:9090" rosDomainId="1" setRos={setRos} />
      {/* <div className="outContainer">
        <h3>ROS Connection:</h3>
        <div className='borderContainer'>
          <h4>ROS bridge IP: <input type="text" value="192.168.7.148" onChange={() => { }} /> </h4>
          <h4>Connection: <span id="status">N/A </span></h4>
        </div>
      </div> */}

      {
        ros &&
        <>
          <JointMotor
            ros={ros}
            namespace={"elevation_joint_motor_1"}
            name={"Motor 1"}
            canId={0x60}
          />
          <JointMotor
            ros={ros}
            namespace={"elevation_joint_motor_2"}
            name={"Motor 2"}
            canId={0x61}
          />
          <JointMotor
            ros={ros}
            namespace={"elevation_joint_motor_3"}
            name={"Motor 3"}
            canId={0x62}
          />
          <JointMotor
            ros={ros}
            namespace={"elevation_joint_motor_4"}
            name={"Motor 4"}
            canId={0x63}
          />
        </>
      }
    </>
  )
}

export default App
