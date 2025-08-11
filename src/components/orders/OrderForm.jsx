import React from 'react';
import PurchaseOrderForm from './PurchaseOrderForm';
import SalesOrderForm from './SalesOrderForm';

const OrderForm = ({ isOpen, onClose, order, orderType, onSave }) => {
  if (!isOpen) return null;

  if (orderType === 'purchase') {
    return <PurchaseOrderForm isOpen={isOpen} onClose={onClose} order={order} onSave={onSave} />;
  }

  return <SalesOrderForm isOpen={isOpen} onClose={onClose} order={order} onSave={onSave} />;
};

export default OrderForm;