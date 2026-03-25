export interface showTodaysClassesProps {
    subject: "Math" | "Science" | "Social" | "Hindi" | "Kannada" | "English"
    startTime: string
    endTime: string
}

export interface ShowTodaysClassesContainerProps {
    classes: showTodaysClassesProps[]
}