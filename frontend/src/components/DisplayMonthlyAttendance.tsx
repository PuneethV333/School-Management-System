import type { returnType } from "../utils/returnMonthsData";

type Props = {
  data: returnType | null;
};

const DisplayMonthlyAttendance = ({data}:Props) => {
    console.log(data);
    
  return (
    <div>DisplayMonthlyAttendance</div>
  )
}

export default DisplayMonthlyAttendance