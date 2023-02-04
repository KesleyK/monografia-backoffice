import React, { useState } from "react";
import { FirebaseErrorCode } from "../enum/errorCode";
import { Alert } from "../../../components";

interface IRequest {
    handler: () => any;
    onSuccess?: (data) => any;
    onFinally?: () => any;
    successMessage?: string;
}

export function useRequest() {
    const [loading, setIsLoading] = useState(false);
    const [responseComponent, setResponseComponent] = useState(null);

    const doRequest = async ({ handler, onSuccess, successMessage, onFinally }: IRequest) => {
        try {
            setIsLoading(true);
            setResponseComponent(null);

            const response = await handler();

            setIsLoading(false);

            if (successMessage) {
                setResponseComponent(<Alert message={successMessage} />);
            }

            if (onSuccess) {
                onSuccess(response);
            }
        } catch (err) {
            const errorCode = err.code;
            const parsedFirebaseError = FirebaseErrorCode[errorCode] ?? FirebaseErrorCode["default/error-message"];

            setIsLoading(false);
            setResponseComponent(<Alert severity="error" message={parsedFirebaseError} />);
        } finally {
            if (onFinally) {
                onFinally();
            }
        }
    };

    return { doRequest, loading, responseComponent };
}
