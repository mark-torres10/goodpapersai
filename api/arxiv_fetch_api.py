"""API for fetching papers from Arxiv."""
import urllib
import urllib.request
import xml.etree.ElementTree as ET
from typing import Optional, Dict, Any
from datetime import datetime

def _parse_arxiv_xml(xml_data: str) -> Optional[Dict[str, Any]]:
    """Parse ArXiv XML response into a dictionary."""
    try:
        # Define namespaces used in ArXiv XML
        namespaces = {
            'atom': 'http://www.w3.org/2005/Atom',
            'arxiv': 'http://arxiv.org/schemas/atom'
        }
        
        # Parse XML
        root = ET.fromstring(xml_data)
        
        # Find the entry element (contains paper data)
        entry = root.find('.//atom:entry', namespaces)
        if entry is None:
            return None
            
        # Extract authors
        authors = [author.find('atom:name', namespaces).text 
                  for author in entry.findall('atom:author', namespaces)]
        
        # Extract links
        links = {link.get('title', 'alternate'): link.get('href') 
                for link in entry.findall('atom:link', namespaces)}
        
        # Extract categories
        categories = [cat.get('term') for cat in entry.findall('atom:category', namespaces)]
        
        # Parse dates
        published = datetime.strptime(
            entry.find('atom:published', namespaces).text,
            '%Y-%m-%dT%H:%M:%SZ'
        )
        updated = datetime.strptime(
            entry.find('atom:updated', namespaces).text,
            '%Y-%m-%dT%H:%M:%SZ'
        )
        
        # Build response dictionary
        paper_data = {
            'title': entry.find('atom:title', namespaces).text.strip(),
            'abstract': ' '.join(entry.find('atom:summary', namespaces).text.strip().split()),
            'authors': authors,
            'arxiv_id': entry.find('atom:id', namespaces).text.split('/')[-1],
            'published_date': published.strftime('%Y-%m-%d'),
            'updated_date': updated.strftime('%Y-%m-%d'),
            'categories': categories,
            'links': links,
            'comment': entry.find('arxiv:comment', namespaces).text if entry.find('arxiv:comment', namespaces) is not None else None
        }
        
        return paper_data
    except Exception as e:
        print(f"Error parsing ArXiv XML: {str(e)}")
        return None

def fetch_paper_from_arxiv_given_id(arxiv_id: str) -> Optional[Dict[str, Any]]:
    """Fetch a paper from Arxiv given an arxiv id."""
    url = f'http://export.arxiv.org/api/query?id_list={arxiv_id}&start=0&max_results=1'
    try:
        data = urllib.request.urlopen(url)
        xml_data = data.read().decode('utf-8')
        return _parse_arxiv_xml(xml_data)
    except Exception as e:
        print(f"Error fetching paper from ArXiv: {str(e)}")
        return None

def fetch_paper_from_arxiv_given_url(url: str) -> Optional[Dict[str, Any]]:
    """Fetch a paper from Arxiv given a url."""
    id = url.split("/")[-1]
    return fetch_paper_from_arxiv_given_id(id)

def fetch_papers_from_arxiv_given_ids(arxiv_ids: list[str]) -> list[Dict[str, Any]]:
    """Fetch papers from Arxiv."""
    ids_str = ",".join(arxiv_ids)
    max_results = len(arxiv_ids)
    url = f'http://export.arxiv.org/api/query?id_list={ids_str}&start=0&max_results={max_results}'
    try:
        data = urllib.request.urlopen(url)
        xml_data = data.read().decode('utf-8')
        
        # Parse multiple entries
        root = ET.fromstring(xml_data)
        namespaces = {
            'atom': 'http://www.w3.org/2005/Atom',
            'arxiv': 'http://arxiv.org/schemas/atom'
        }
        
        papers = []
        for entry in root.findall('.//atom:entry', namespaces):
            entry_xml = ET.tostring(entry, encoding='unicode')
            paper_data = _parse_arxiv_xml(f'<?xml version="1.0" encoding="UTF-8"?>\n<feed xmlns="http://www.w3.org/2005/Atom">{entry_xml}</feed>')
            if paper_data:
                papers.append(paper_data)
        
        return papers
    except Exception as e:
        print(f"Error fetching papers from ArXiv: {str(e)}")
        return []
