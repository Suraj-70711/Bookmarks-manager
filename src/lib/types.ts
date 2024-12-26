export interface LinkItem {
    id: string;
    label: string
    url: string
    priority: Priority
}

export enum Priority {
    MostPrior,
    Prior,
    LeastPrior
}