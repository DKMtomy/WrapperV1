import { FormCancelationReason } from '@minecraft/server-ui';

/**
 * Modal response from form.
 */
export interface ModalFormResponse<T = any> {
    /**
     * Values in order.
     */
    readonly formValues?: T[];
    /**
     * Form was canceled?
     */
    readonly isCanceled: boolean;
}

/**
 * Message response from form.
 */
export interface MessageFormResponse<T = number> {
    /**
     * Selected value.
     */
    readonly selection?: T;
    /**
     * Form was canceled?
     */
    readonly isCanceled: boolean extends T ? false : boolean;
}

/**
 * Action response from form.
 */
export interface ActionFormResponse {
    /**
     * Selected value.
     */
    readonly selection?: number
    /**
     * Form was canceled?
     */
    readonly isCanceled: boolean
  }
