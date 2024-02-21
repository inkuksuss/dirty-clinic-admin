export enum ReservationState {
    PAID = 'paid',
    CANCELLED = 'cancelled',
    FAILED = 'failed'
}

export enum ReservationType {
    ONE_ROOM = 'ONE_ROOM',
    HOUSE = 'HOUSE'
}

export type Reservation = {
    id: number;
    memberName: string;
    reservationType: ReservationType;
    reservationDate: string;
    hasPromotion: boolean;
    reservationState: ReservationState;
    balanceAmount: string;
    isChecked: boolean;
    created: string;
};

export type PageType = {
    currentPage: number;
    totalElement: number;
    hasNext: boolean;
    totalPage: number;
    viewList: number[];
};

export type SelectType = {
    name: string;
    value: string;
};

export type User = {
    id: string;
    name: string;
};

export enum PopupType {
    RESERVATION_PAYMENT = 'RESERVATION_PAYMENT'
}

export type ApiResponse<T> = {
    code: number;
    message: string;
    data: T;
};

export type IAmPortPaymentRequest = {
    pg: string;
    pay_method: string | null;
    merchant_uid: string;
    name: string;
    amount: number;
    buyer_email: string | null;
    buyer_name: string | null;
    buyer_tel: string | null;
    buyer_addr: string | null;
    buyer_postcode: string | null;
    bypass?: object;
    notice_url?: string;
};

export type IAmPortPgBaseRequest = {
    pg: string;
    pay_method?: string;
    buyer_tel?: string;
};

export type IAmPortPaymentResponse = {
    apply_num: string | null;
    bank_name: string | null;
    buyer_addr: string | null;
    buyer_email: string | null;
    buyer_name: string | null;
    buyer_postcode: string | null;
    buyer_tel: string | null;
    card_name: string | null;
    card_number: string | null;
    card_quota: number;
    currency: string | null;
    custom_data: string | null;
    imp_uid: string;
    merchant_uid: string;
    name: string;
    paid_amount: number;
    paid_at: number;
    pay_method: string;
    pg_provider: string;
    pg_tid: string | null;
    pg_type: string | null;
    receipt_url: string;
    status: string;
    success: boolean;
    error_msg?: string;
};

export type PaymentPrepareRequest = {
    productId: number;
    productName: string;
    phoneNumber: string;
    address: string;
    footage: number;
    description: string;
    amount: number;
    isAgreePolicy: boolean;
};

export type PaymentResultRequest = {
    applyNum: string | null;
    bankName: string | null;
    buyerAddr: string | null;
    buyerEmail: string | null;
    buyerName: string | null;
    buyerPostcode: string | null;
    buyerTel: string | null;
    cardName: string | null;
    cardNumber: string | null;
    cardQuota: number;
    currency: string | null;
    customData: string | null;
    impUid: string;
    merchantUid: string;
    name: string;
    paidAmount: number;
    paidAt: number;
    payMethod: string;
    pgProvider: string;
    pgTid: string | null;
    pgType: string | null;
    receiptUrl: string;
    status: string;
    success: boolean;
    errorMsg?: string;
};
