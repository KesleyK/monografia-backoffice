import React, { useState } from "react";
import { FirebaseErrorCode } from "../enum/errorCode";
import { ErrorAlert } from "../../components";

interface IRequest {
    handler: () => any;
    onSuccess?: (data) => any;
}

export function useRequest() {
    const [loading, setIsLoading] = useState(false);
    const [responseComponent, setResponseComponent] = useState(null);

    const doRequest = async ({ handler, onSuccess }: IRequest) => {
        try {
            setIsLoading(true);
            setResponseComponent(null);

            const response = await handler();
            if (onSuccess) onSuccess(response);
        } catch (err) {
            const parsedFirebaseError = FirebaseErrorCode[err.code] ?? FirebaseErrorCode["default/error-message"];

            setIsLoading(false);
            setResponseComponent(<ErrorAlert errorMessage={parsedFirebaseError} />);
        }
    };

    return { doRequest, loading, responseComponent };
}
