import "./ClassRangeContainer.css";
import { IClassRange } from "../../interfaces/IClassRange";
import { ClassRangeItem } from "../ClassRangeItem/ClassRangeItem";
import useLocalStorage from "use-local-storage";

interface IClassRangeContainerProps {
	class_ranges: IClassRange[];
}

export const ClassRangeContainer = (props: IClassRangeContainerProps) => {
	const [activeClassRange, setActiveClassRange] = useLocalStorage("active_class_range", props.class_ranges[0].uuid);


	return (
		<div className="class_range_container">
			{props.class_ranges.map(class_range =>
				<ClassRangeItem
					data={{ ...class_range, active: class_range.uuid === activeClassRange }}
					onUpdateClassRange={(e) => null} />)}
		</div>
	);
};