import { useContext } from 'react';
import AlertContext from '../../context/AlertContext';

const Alert = () => {
  const { alerts } = useContext(AlertContext);
  
  return (
    <div className="alert-wrapper">
      {alerts.length > 0 &&
        alerts.map(alert => (
          <div key={alert.id} className={`alert alert-${alert.type}`}>
            {alert.msg}
          </div>
        ))}
    </div>
  );
};

export default Alert;