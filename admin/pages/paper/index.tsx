import React from 'react';
import { PageContainer } from '@keystone-6/core/admin-ui/components';
import { Button } from '@keystone-ui/button';
import { PlusIcon } from '@keystone-ui/icons/icons/PlusIcon';
import Link from 'next/link';
import { gql, useQuery } from '@keystone-6/core/admin-ui/apollo';

const PAPERS_LIST_QUERY = gql`
  query {
    papers {
      id
      title
      authors
      year
    }
  }
`;

// This is a custom Paper list page with an "Add from ArXiv" button
export default function CustomPaperList() {
  const { data, loading, error } = useQuery(PAPERS_LIST_QUERY);

  return (
    <PageContainer
      header={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>Papers</h1>
          <Link href="/paper/import-from-arxiv" passHref>
            <Button 
              tone="positive" 
              size="small"
              style={{ marginLeft: '1rem' }}
            >
              <PlusIcon size="small" />
              <span style={{ marginLeft: '0.5rem' }}>Add from ArXiv</span>
            </Button>
          </Link>
        </div>
      }
    >
      <div>
        {loading ? (
          <p>Loading papers...</p>
        ) : error ? (
          <p>Error loading papers</p>
        ) : data?.papers?.length ? (
          <ul>
            {data.papers.map((paper: any) => (
              <li key={paper.id}>
                <strong>{paper.title}</strong> by {paper.authors} ({paper.year})
              </li>
            ))}
          </ul>
        ) : (
          <p>No papers found. Add one using the "Add from ArXiv" button above.</p>
        )}
      </div>
    </PageContainer>
  );
} 