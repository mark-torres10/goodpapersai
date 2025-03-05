const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'papers.db');
const db = new sqlite3.Database(dbPath);

// Sample papers data
const samplePapers = [
  {
    id: '1',
    title: 'Attention Is All You Need',
    authors: JSON.stringify(['Ashish Vaswani', 'Noam Shazeer', 'Niki Parmar', 'Jakob Uszkoreit', 'Llion Jones', 'Aidan N. Gomez', 'Łukasz Kaiser', 'Illia Polosukhin']),
    journal: 'Advances in Neural Information Processing Systems',
    year: 2017,
    doi: '10.48550/arXiv.1706.03762',
    url: 'https://arxiv.org/abs/1706.03762',
    abstract: 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely. Experiments on two machine translation tasks show these models to be superior in quality while being more parallelizable and requiring significantly less time to train.',
    is_currently_reading: 1
  },
  {
    id: '2',
    title: 'BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding',
    authors: JSON.stringify(['Jacob Devlin', 'Ming-Wei Chang', 'Kenton Lee', 'Kristina Toutanova']),
    journal: 'arXiv preprint',
    year: 2018,
    doi: '10.48550/arXiv.1810.04805',
    url: 'https://arxiv.org/abs/1810.04805',
    abstract: 'We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations from Transformers. Unlike recent language representation models, BERT is designed to pre-train deep bidirectional representations from unlabeled text by jointly conditioning on both left and right context in all layers. As a result, the pre-trained BERT model can be fine-tuned with just one additional output layer to create state-of-the-art models for a wide range of tasks, such as question answering and language inference, without substantial task-specific architecture modifications.',
    is_currently_reading: 1
  },
  {
    id: '3',
    title: 'GPT-3: Language Models are Few-Shot Learners',
    authors: JSON.stringify(['Tom B. Brown', 'Benjamin Mann', 'Nick Ryder', 'Melanie Subbiah', 'Jared Kaplan', 'Prafulla Dhariwal', 'et al.']),
    journal: 'Advances in Neural Information Processing Systems',
    year: 2020,
    doi: '10.48550/arXiv.2005.14165',
    url: 'https://arxiv.org/abs/2005.14165',
    abstract: 'Recent work has demonstrated substantial gains on many NLP tasks and benchmarks by pre-training on a large corpus of text followed by fine-tuning on a specific task. While typically task-agnostic in architecture, this method still requires task-specific fine-tuning datasets of thousands or tens of thousands of examples. By contrast, humans can generally perform a new language task from only a few examples or from simple instructions - something which current NLP systems still largely struggle to do. Here we show that scaling up language models greatly improves task-agnostic, few-shot performance, sometimes even reaching competitiveness with prior state-of-the-art fine-tuning approaches.',
    is_currently_reading: 0
  },
  {
    id: '4',
    title: 'Deep Residual Learning for Image Recognition',
    authors: JSON.stringify(['Kaiming He', 'Xiangyu Zhang', 'Shaoqing Ren', 'Jian Sun']),
    journal: 'IEEE Conference on Computer Vision and Pattern Recognition',
    year: 2016,
    doi: '10.1109/CVPR.2016.90',
    url: 'https://arxiv.org/abs/1512.03385',
    abstract: 'Deeper neural networks are more difficult to train. We present a residual learning framework to ease the training of networks that are substantially deeper than those used previously. We explicitly reformulate the layers as learning residual functions with reference to the layer inputs, instead of learning unreferenced functions. We provide comprehensive empirical evidence showing that these residual networks are easier to optimize, and can gain accuracy from considerably increased depth. On the ImageNet dataset we evaluate residual nets with a depth of up to 152 layers—8× deeper than VGG nets but still having lower complexity.',
    is_currently_reading: 0
  }
];

// Create tables
db.serialize(() => {
  // Create papers table
  db.run(`
    CREATE TABLE IF NOT EXISTS papers (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      authors TEXT NOT NULL,
      journal TEXT,
      year INTEGER NOT NULL,
      doi TEXT,
      url TEXT,
      abstract TEXT,
      is_currently_reading INTEGER DEFAULT 0
    )
  `);

  // Create updates table
  db.run(`
    CREATE TABLE IF NOT EXISTS updates (
      id TEXT PRIMARY KEY,
      paper_id TEXT NOT NULL,
      paper_title TEXT NOT NULL,
      message TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      FOREIGN KEY (paper_id) REFERENCES papers (id)
    )
  `);

  // Insert sample papers
  const insertPaper = db.prepare(`
    INSERT OR REPLACE INTO papers 
    (id, title, authors, journal, year, doi, url, abstract, is_currently_reading)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  samplePapers.forEach(paper => {
    insertPaper.run(
      paper.id,
      paper.title,
      paper.authors,
      paper.journal,
      paper.year,
      paper.doi,
      paper.url,
      paper.abstract,
      paper.is_currently_reading
    );
  });

  insertPaper.finalize();

  // Insert sample updates
  const sampleUpdates = [
    {
      id: '1',
      paper_id: '1',
      paper_title: 'Attention Is All You Need',
      message: 'Started reading',
      timestamp: new Date(2023, 5, 10).toISOString()
    },
    {
      id: '2',
      paper_id: '2',
      paper_title: 'BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding',
      message: 'Added to library',
      timestamp: new Date(2023, 5, 8).toISOString()
    },
    {
      id: '3',
      paper_id: '1',
      paper_title: 'Attention Is All You Need',
      message: 'Finished reading',
      timestamp: new Date(2023, 5, 15).toISOString()
    }
  ];

  const insertUpdate = db.prepare(`
    INSERT OR REPLACE INTO updates 
    (id, paper_id, paper_title, message, timestamp)
    VALUES (?, ?, ?, ?, ?)
  `);

  sampleUpdates.forEach(update => {
    insertUpdate.run(
      update.id,
      update.paper_id,
      update.paper_title,
      update.message,
      update.timestamp
    );
  });

  insertUpdate.finalize();
});

// Close the database connection
db.close(err => {
  if (err) {
    console.error('Error closing database:', err.message);
  } else {
    console.log('Database initialized successfully');
  }
}); 