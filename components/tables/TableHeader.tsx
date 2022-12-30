import { Tooltip } from '@chakra-ui/react';
import React from 'react';

export const TableHeader = ({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) => (
  <Tooltip placement="top" label={title} isDisabled={!title}>
    {children}
  </Tooltip>
);
