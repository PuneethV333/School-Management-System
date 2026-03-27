export interface dashboardGraphInputProps{
    date:Date,
    day:"Monday"|"Tuesday"|"Wednesday"|"Thursday"|"Friday"|"Sunday"
    presentPercentage:number,
    total:number
}

export interface Day  {
  isSunday: boolean;
  presentCount: number | string | null;
};
