import React, { useState } from "react";
import { FirebaseErrorCode } from "../enum/errorCode";
import { Alert } from "../../../components";

interface IRequest {
    handler: () => any;
    onSuccess?: (data) => any;
    successMessage?: string;
}

export function useRequest() {
    const [loading, setIsLoading] = useState(false);
    const [responseComponent, setResponseComponent] = useState(null);

    const doRequest = async ({ handler, onSuccess, successMessage }: IRequest) => {
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
            console.log(err);
            const errorCode = err.code ?? "default/error-message";
            const parsedFirebaseError = FirebaseErrorCode[errorCode];

            setIsLoading(false);
            setResponseComponent(<Alert severity="error" message={parsedFirebaseError} />);
        }
    };

    return { doRequest, loading, responseComponent };
}
