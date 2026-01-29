import message from "../../assets/message.png";
import camera from "../../assets/camera.png";
import call from "../../assets/call.png";
import emergency from "../../assets/emergency.png";
import Card from "../../components/dashboard/Card";
import { useEmergency } from "../../context/EmergencyContext";

const Dashboard: React.FC = () => {
  const { isActiveEmergency } = useEmergency();

  return (
    <div className="grid grid-cols-responsive gap-6 h-80 justify-center max-w-6xl w-full mx-auto">
      <Card
        title="Secure Call"
        imageSrc={call}
        bgColor="bg-white"
        textColor="text-oliveLight"
        link="/dashboard/call"
      />
      <Card
        title="Secure Messaging"
        imageSrc={message}
        bgColor="bg-oliveLight"
        textColor="text-white"
        link="/dashboard/home"
      />
      <Card
        title="Camera"
        imageSrc={camera}
        bgColor="bg-oliveLight"
        textColor="text-white"
        link="/dashboard/home"
      />
      <Card
        title="Emergency"
        imageSrc={emergency}
        bgColor="bg-[#d12229]"
        textColor="text-white"
        link="/dashboard/control-center"
        isEmergency={isActiveEmergency}
      />
    </div>
  );
};

export default Dashboard;
