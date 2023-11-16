export interface IClassRange {
	uuid: string;
	name: string;
}

export interface IClassRangeState extends IClassRange {
	active: boolean;
}