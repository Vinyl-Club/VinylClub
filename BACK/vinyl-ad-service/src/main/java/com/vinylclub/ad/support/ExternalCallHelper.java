package com.vinylclub.ad.support;

import java.util.function.Supplier;

import org.springframework.stereotype.Component;

import com.vinylclub.ad.exception.ExternalServiceException;
import com.vinylclub.ad.exception.ResourceNotFoundException;

import feign.FeignException;
import feign.RetryableException;

/**
 *Error handling of external services
 */
@Component
public class ExternalCallHelper {

    /**
     *Wrapper for Feign calls.
     *Centralizes error management to avoid repeating try/catch everywhere.
     *
     *Rules:
     *-404 -> ResourceNotFoundException
     *-timeout/network -> ExternalServiceException
     *-other Feign errors -> ExternalServiceException (with status)
     *
     * @param serviceName name of the service called (for the error message)
     * @param call Feign call to execute
     */
    public <T> T callExternal(String serviceName, Supplier<T> call) {
        try {
            return call.get();

        } catch (FeignException.NotFound e) {
            throw new ResourceNotFoundException(serviceName + " : ressource introuvable");

        } catch (RetryableException e) {
            throw new ExternalServiceException(serviceName + " indisponible (timeout/réseau)", e);

        } catch (FeignException e) {
            throw new ExternalServiceException(serviceName + " erreur (status " + e.status() + ")", e);
        }
    }

    /**
     *"Tolerant" variant: returns null if the call fails.
     *Useful when you prefer to display a partial page rather than return an error.
     *
     * @param call Feign call to execute
     * @return result if OK, otherwise null
     */
    public <T> T callExternalOrNull(Supplier<T> call) {
        try {
            return call.get();
        } catch (Exception e) {
            return null;
        }
    }

    public void callExternalVoid(String serviceName, Runnable call) {
    try {
        call.run();

    } catch (FeignException.NotFound e) {
        throw new ResourceNotFoundException(serviceName + " : ressource introuvable");

    } catch (RetryableException e) {
        throw new ExternalServiceException(serviceName + " indisponible (timeout/réseau)", e);

    } catch (FeignException e) {
        throw new ExternalServiceException(serviceName + " erreur (status " + e.status() + ")", e);
    }
}

}
