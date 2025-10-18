import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from './pagination';

const meta: Meta<typeof Pagination> = {
  title: 'Components/Pagination',
  component: Pagination,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious onClick={() => console.log('Previous')} />
        </PaginationItem>

        <PaginationItem>
          <PaginationLink onClick={() => console.log('Page 1')}>1</PaginationLink>
        </PaginationItem>

        <PaginationItem>
          <PaginationLink onClick={() => console.log('Page 2')} isActive>
            2
          </PaginationLink>
        </PaginationItem>

        <PaginationItem>
          <PaginationLink onClick={() => console.log('Page 3')}>3</PaginationLink>
        </PaginationItem>

        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>

        <PaginationItem>
          <PaginationLink onClick={() => console.log('Page 8')}>8</PaginationLink>
        </PaginationItem>

        <PaginationItem>
          <PaginationNext onClick={() => console.log('Next')} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
};
