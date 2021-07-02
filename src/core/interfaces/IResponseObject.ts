export interface IResponseObject {
    success: boolean;
    data?: Object;
    errors?: Object;
    trace_id: string;
}
