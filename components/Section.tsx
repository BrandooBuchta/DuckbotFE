import { Card, Image, Text, Badge, Button, Group } from '@mantine/core';
import { FC, JSX } from 'react';

interface SectionProps {
  title?: string;
  children: JSX.Element[] | JSX.Element;
}

const Section: FC<SectionProps> = ({ title, children }) => {
  return (
    <Card>
      <Text fw="bold" size="xl">{title}</Text>
      <Group justify="space-between" mb="xs" className='flex w-full'>
        {children}
      </Group>
    </Card>
  );
}

export default Section;