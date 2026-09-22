// data.js
// Base de dados completa do HairOS - 95 estilos
// ============================================================

// ============================================================
// VARIAÇÕES DE ALTURA PARA CARDS
// ============================================================
var alturasHome = ['h-md', 'h-lg'];

function getAlturaHome() {
  return Math.random() < 0.5 ? 'h-md' : 'h-lg';
}

// ============================================================
// FUNÇÃO PARA EMBARALHAR ARRAY
// ============================================================
function shuffleArray(arr) {
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
}

// ============================================================
// FUNÇÃO PARA BUSCAR PRODUTOS COMPLETOS
// ============================================================
function getOtherProductsData(currentId, categoria, count) {
  var allProducts = [];
  var sourceData;
  if (categoria === 'kit') sourceData = kitsData;
  else if (categoria === 'ferramentas') sourceData = ferramentasData;
  else sourceData = produtosData;

  sourceData.forEach(function (item) {
    var id = item[0];
    var cat = item[1];
    var corte = item[2];
    var title = item[3];
    var desc = item[4];
    var img = item[5];
    var variants = item[6];

    if (id !== currentId) {
      allProducts.push({
        id: id,
        categoria: cat,
        corte: corte,
        title: title,
        desc: desc,
        img: img,
        variants: variants ? variants.slice(0, 3) : [img]
      });
    }
  });

  shuffleArray(allProducts);

  var unique = [];
  var seen = {};
  allProducts.forEach(function (item) {
    if (!seen[item.id]) {
      seen[item.id] = true;
      unique.push(item);
    }
  });

  return unique.slice(0, count);
}

// ============================================================
// HELPERS INTERNOS DO createCard
// ============================================================

function _getVariantUrl(variant) {
  if (typeof variant === 'object' && variant !== null) return variant.img;
  return variant;
}

function _dedupeVariantsByUrl(variants) {
  var seen = {};
  var unique = [];
  variants.forEach(function (v) {
    var url = _getVariantUrl(v);
    if (url && !seen[url]) {
      seen[url] = true;
      unique.push(v);
    }
  });
  return unique;
}

function _buildProdutoKitVariants(id, categoria, corte, title, desc, img, variants) {
  var finalVariants = [];

  var ownImages = Array.isArray(variants) && variants.length > 0
    ? variants.slice(0, 3)
    : [img];

  ownImages.forEach(function (imgUrl) {
    finalVariants.push({
      img: imgUrl,
      corte: corte,
      title: title,
      desc: desc,
      own: true
    });
  });

  var otherProducts = getOtherProductsData(id, categoria, 7);

  otherProducts.forEach(function (product) {
    var otherImg = (product.variants && product.variants.length > 0)
      ? product.variants[0]
      : product.img;

    finalVariants.push({
      img: otherImg,
      corte: product.corte,
      title: product.title,
      desc: product.desc,
      own: false,
      productId: product.id
    });
  });

  while (finalVariants.length < 10) {
    var randomImg = ownImages[Math.floor(Math.random() * ownImages.length)];
    finalVariants.push({
      img: randomImg,
      corte: corte,
      title: title,
      desc: desc,
      own: true
    });
  }

  return { finalVariants: finalVariants, otherProducts: otherProducts };
}

function _buildCorteColoracaoVariants(img, variants) {
  var rawVariants = Array.isArray(variants) && variants.length > 0
    ? variants.slice(0, 10)
    : [img];

  var unique = _dedupeVariantsByUrl(rawVariants);

  if (unique.length === 0) unique = [img];

  return unique;
}

// ============================================================
// FUNÇÃO PRINCIPAL
// ============================================================
function createCard(id, categoria, corte, title, desc, img, variants) {
  var finalVariants = [];
  var otherProductsData = [];

  var isProdutoKit = (categoria === 'produto' || categoria === 'kit' || categoria === 'ferramentas');
  var isCorteColoracao = (categoria === 'corte' || categoria === 'coloracao');

  if (isProdutoKit) {
    var resultado = _buildProdutoKitVariants(id, categoria, corte, title, desc, img, variants);
    finalVariants = resultado.finalVariants;
    otherProductsData = resultado.otherProducts;
  } else if (isCorteColoracao) {
    finalVariants = _buildCorteColoracaoVariants(img, variants);
  }

  return {
    id: id,
    categoria: categoria,
    corte: corte,
    title: title,
    desc: desc,
    img: img,
    variants: finalVariants,
    otherProductsData: otherProductsData,
    coloracao: coloracaoKits,
    cuidados: cuidadosKits,
    altura: getAlturaHome(),
    isUserPhoto: id && id.startsWith('user_')
  };
}

// ============================================================
// DADOS DOS KITS DE COLORAÇÃO E CUIDADOS
// ============================================================
var coloracaoKits = {
  kits: [{
    nome: 'Kit Keune',
    badge: 'Comercial',
    link: 'https://meli.la/1GbiW7M',
    produtos: 'Tinta Color + Semi Color + Oxidante 20 vol + Ativador de Cor',
    imagem: 'https://i.pinimg.com/736x/f9/71/b6/f971b6679e2c7fda2f777c25d6e49b66.jpg'
  }, {
    nome: 'Kit L\'Oréal',
    badge: 'Técnico',
    link: 'https://meli.la/28LpPj2',
    produtos: 'Tinta INOA + Tonalizante Dia Color + Oxidante 20 vol + Revelador 9 vol',
    imagem: 'https://i.pinimg.com/1200x/8a/c7/0e/8ac70e6de8ca914b0a3e53ff6b93a0cc.jpg'
  }]
};

var cuidadosKits = {
  kits: [{
    nome: 'Kit Kerastase',
    badge: 'Premium',
    link: 'https://meli.la/1MwSY7v',
    produtos: 'Shampoo Nutritive + Condicionador Resistance + Máscara Genesis + Leave-In Elixir Ultime',
    imagem: 'https://i.pinimg.com/1200x/0c/dd/f1/0cddf1a088784488cc73ffbedfa53ebf.jpg'
  }, {
    nome: 'Kit L\'Oréal Expert',
    badge: 'Profissional',
    link: 'https://meli.la/2nmeunk',
    produtos: 'Shampoo Vitamino Color + Condicionador Absolut Repair + Máscara Nutrioil + Sérum Pro Longer',
    imagem: 'https://i.pinimg.com/736x/5b/da/00/5bda009665f3eff9b6aa04f58e2c473f.jpg'
  }, {
    nome: 'Kit Joico',
    badge: 'Hidratação',
    link: 'https://meli.la/2x9xqBe',
    produtos: 'Shampoo Moisture Recovery + Condicionador + Máscara Intensa + Leave-In K-PAK',
    imagem: 'https://i.pinimg.com/1200x/55/d6/10/55d610f599b3c10b5fe4cafceb5104fc.jpg'
  }]
};

// ============================================================
// DADOS: CORTES (30 itens)
// ============================================================
var cortesData = [
  ['velvet-bob', 'corte', 'Velvet Bob', 'Bob Texturizado',
    'Bob com camadas internas que criam volume sem peso. Ideal para cabelos finos que precisam de movimento.',
    'https://i.pinimg.com/736x/d7/a8/8c/d7a88c60e5f7ce217264486e3fc506f4.jpg',
    [
      'https://i.pinimg.com/736x/4a/d9/5b/4ad95bf7e6b141aadff33031fd09e9c5.jpg',
      'https://i.pinimg.com/736x/8d/9d/d7/8d9dd736af07495c8cd74672e0c88476.jpg',
      'https://i.pinimg.com/736x/bf/d5/70/bfd57032bcaddc8df549a25c2f5ee43e.jpg',
      'https://i.pinimg.com/736x/83/7b/6a/837b6aca26c733bd41c28c0153942a49.jpg',
      'https://i.pinimg.com/736x/46/34/e4/4634e474c43b6a8aa6f7459023b5ab94.jpg',
      'https://i.pinimg.com/736x/37/7a/d5/377ad5273df5fe2cf671d873d31d6393.jpg',
      'https://i.pinimg.com/736x/c4/06/57/c40657b0890088f4007ab9cc047c548e.jpg',
      'https://i.pinimg.com/736x/57/00/8b/57008bbead8ee5cbd7259af613e74690.jpg',
      'https://i.pinimg.com/736x/50/40/cb/5040cb20ff9f1936cda703a116cc6800.jpg',
      'https://i.pinimg.com/736x/12/97/7a/12977a09186ad656e31bd1820ebca998.jpg'
    ]
  ],
  ['pixie-cut', 'corte', 'Pixie Cut', 'Corte Curto Texturizado',
    'Corte curto e prático com volume no topo. Perfeito para quem busca um visual moderno e de fácil manutenção.',
    'https://i.pinimg.com/736x/34/27/f8/3427f83ed4451e1e17aa9822e4201d96.jpg',
    [
      'https://i.pinimg.com/736x/c7/96/f6/c796f647e8e72985856e0032ffba1bd1.jpg',
      'https://i.pinimg.com/736x/86/95/8b/86958b5ee0a8cbf5e0082666ef203ed7.jpg',
      'https://i.pinimg.com/736x/25/f3/7a/25f37a9f5dd2740755ba53f3f3f4f313.jpg',
      'https://i.pinimg.com/736x/86/7d/73/867d730483c8d6db0a09f2c8e8f93427.jpg',
      'https://i.pinimg.com/736x/88/1e/dc/881edc6b830ca7fd49a95d551425b0c6.jpg',
      'https://i.pinimg.com/736x/21/13/90/211390e156a9c58109c38eb79b7fc2f2.jpg',
      'https://i.pinimg.com/736x/c8/ed/d8/c8edd8088204b8fd6f08beb57300c820.jpg',
      'https://i.pinimg.com/736x/3b/40/e6/3b40e60333fe00cec1b0a56cd5892dc8.jpg',
      'https://i.pinimg.com/736x/c3/56/54/c35654251423eb9a44ea088a3bf17c90.jpg',
      'https://i.pinimg.com/236x/ad/e7/ab/ade7ab449fad2d5f26c782b0aea4988f.jpg'
    ]
  ],
  ['butterfly-cut', 'corte', 'Butterfly Cut', 'Camadas em Asa',
    'Camadas em formato de asas que emolduram o rosto e mantêm o comprimento. Ótimo para dar leveza aos fios.',
    'https://i.pinimg.com/736x/08/ab/69/08ab69db905060f2e62a6bed57d3e74e.jpg',
    [
      'https://i.pinimg.com/736x/5d/03/57/5d03576e6204c75b1bcd95d3f60c0e49.jpg',
      'https://i.pinimg.com/736x/35/83/99/358399b0b37e83d864a58c0237875a9d.jpg',
      'https://i.pinimg.com/736x/31/19/fb/3119fb4703a12cd9867c83cc38be904e.jpg',
      'https://i.pinimg.com/736x/1e/79/0e/1e790e7d03357af0bb59fae1aaae5985.jpg',
      'https://i.pinimg.com/1200x/ec/97/85/ec9785ae609edd9958245167b09b776a.jpg',
      'https://i.pinimg.com/736x/66/bb/26/66bb266d7934a62d3f30132a9f8e7bc6.jpg',
      'https://i.pinimg.com/1200x/e0/78/98/e078985c0a53eb4cab512bc560332e25.jpg',
      'https://i.pinimg.com/1200x/cb/85/d2/cb85d255cd035178f3f3270ab9943769.jpg',
      'https://i.pinimg.com/1200x/55/93/b2/5593b2539cc1c588ed90f7070a3cda0b.jpg',
      'https://i.pinimg.com/736x/3e/08/65/3e0865833599c47473882c25165ecbfc.jpg'
    ]
  ],
  ['blunt-cut', 'corte', 'Blunt Cut', 'Corte Reto Preciso',
    'Corte reto e preciso, sem camadas. Realça a densidade e o peso dos fios, com acabamento marcante.',
    'https://i.pinimg.com/736x/06/15/ff/0615ff8b4ad4d40cf86d8f738b91eb44.jpg',
    [
      'https://i.pinimg.com/736x/87/1e/58/871e58b257c2ea53fbf7d71e76ffac3d.jpg',
      'https://i.pinimg.com/736x/37/06/de/3706de631afd06d34889c7957cea2ac1.jpg',
      'https://i.pinimg.com/736x/d6/ad/6e/d6ad6ed52b34ec8c0864345b5a79f80b.jpg',
      'https://i.pinimg.com/736x/4c/81/ed/4c81edd88a8f0fd8864e8b62fe0ed142.jpg',
      'https://i.pinimg.com/736x/4e/56/aa/4e56aa5be62fef617d4f6b5859aa8877.jpg',
      'https://i.pinimg.com/736x/f5/b8/5a/f5b85a3a195abe2e8fc1a475877a3e59.jpg',
      'https://i.pinimg.com/736x/9f/ff/28/9fff284e6d32430e4e8c7528c5db8b2a.jpg',
      'https://i.pinimg.com/736x/8d/90/4a/8d904a812c89f78d6a6580479c5639ac.jpg',
      'https://i.pinimg.com/236x/da/86/9a/da869a53567960e3ec375761ad87282e.jpg',
      'https://i.pinimg.com/236x/09/99/a2/0999a2392476e22f3e1540928e506741.jpg'
    ]
  ],
  ['shaggy-hair', 'corte', 'Shaggy Hair', 'Camadas Desconectadas',
    'Camadas desconectadas e franja despretensiosa. Estilo despojado com textura e movimento natural.',
    'https://i.pinimg.com/736x/e7/6a/22/e76a22e038cba1d1daad41e6f2238004.jpg',
    [
      'https://i.pinimg.com/736x/6b/2f/c2/6b2fc2069e0ab8ba141565ea5e582d58.jpg',
      'https://i.pinimg.com/736x/c9/2d/a3/c92da3565d7caf7b75db3fdceb30533f.jpg',
      'https://i.pinimg.com/236x/99/7b/f9/997bf983affdcdec08562f8a02c374b6.jpg',
      'https://i.pinimg.com/736x/57/72/22/5772226643794074a0c51185ea867c17.jpg',
      'https://i.pinimg.com/736x/d7/f2/2b/d7f22bca30309f62004694c1f7dafa73.jpg',
      'https://i.pinimg.com/736x/df/5b/db/df5bdb685898292a9ca41b8bbb43ab31.jpg',
      'https://i.pinimg.com/736x/e2/ab/f8/e2abf8b4b139df7b29c8551f40d4d338.jpg',
      'https://i.pinimg.com/736x/2a/eb/88/2aeb88213907101e1792b014a75fb4b3.jpg',
      'https://i.pinimg.com/736x/e0/ab/81/e0ab810bc60a2b40ec842c78a01f2de0.jpg',
      'https://i.pinimg.com/736x/46/bb/b8/46bbb8d4c1c4a748cb6cd717378d2e1a.jpg'
    ]
  ],
  ['long-bob', 'corte', 'Long Bob', 'Bob Ombro Inclinado',
    'Base na altura dos ombros com leve inclinação frontal. Versátil e fácil de modelar.',
    'https://i.pinimg.com/736x/63/fc/05/63fc05a4610ab0214e2e74e3d6a0014f.jpg',
    [
      'https://i.pinimg.com/736x/96/ed/ba/96edbad796f6419dde511218d30b4a89.jpg',
      'https://i.pinimg.com/736x/97/12/55/971255981aaef5c19d234cbe7bb15b5b.jpg',
      'https://i.pinimg.com/736x/20/e5/0e/20e50e3d7d91ea1c77739beef358253e.jpg',
      'https://i.pinimg.com/736x/d2/3f/6c/d23f6cb6d4eba707e8af9dbd0365d7b3.jpg',
      'https://i.pinimg.com/236x/5b/d6/67/5bd6678622f65f802a790f27193d2b43.jpg',
      'https://i.pinimg.com/736x/b3/23/38/b323381530d017a718dfd57ebb70f280.jpg',
      'https://i.pinimg.com/736x/f2/f4/09/f2f4094f58a52962676524bcc79dc511.jpg',
      'https://i.pinimg.com/736x/a3/c2/a8/a3c2a82d52cb1f590ebbb7b6ba386229.jpg',
      'https://i.pinimg.com/736x/03/38/48/033848a08f6285b6473392e31710c7b5.jpg',
      'https://i.pinimg.com/736x/62/56/a8/6256a87f0bc5ce4ad04e5008e3e75c3c.jpg'
    ]
  ],
  ['french-bob', 'corte', 'French Bob', 'Chanel com Franja',
    'Chanel curto na altura do maxilar com franja reta. Clássico, sofisticado e atemporal.',
    'https://i.pinimg.com/1200x/fa/83/3a/fa833a9f5008d52cbf0f86a0665bbe15.jpg',
    [
      'https://i.pinimg.com/736x/dd/80/09/dd80099cba2352f7f65c919016a5dbe1.jpg',
      'https://i.pinimg.com/736x/e0/df/ae/e0dfaebb413bd160699c30d24725a3fe.jpg',
      'https://i.pinimg.com/736x/55/45/71/5545719a22d414ab9294aa7baa9e4fff.jpg',
      'https://i.pinimg.com/736x/35/17/da/3517da17cfe29e89c2d7eb754df86ac9.jpg',
      'https://i.pinimg.com/736x/db/f7/9e/dbf79ed817e0b975c55cb26dbd34e429.jpg',
      'https://i.pinimg.com/736x/4a/3e/83/4a3e831657711fc4dc97a197a4f1a999.jpg',
      'https://i.pinimg.com/736x/66/64/19/666419699950d29fb4e1d8c7f5856acf.jpg',
      'https://i.pinimg.com/736x/47/44/7a/47447a0b919613631d537b2b80e8f319.jpg',
      'https://i.pinimg.com/736x/98/6f/3b/986f3b7f6ece364be7d82c4748a47d19.jpg',
      'https://i.pinimg.com/736x/19/1d/6c/191d6c53cbf97ef7288ede40819b29df.jpg'
    ]
  ],
  ['italian-bob', 'corte', 'Italian Bob', 'Bob com Repicados',
    'Bob na altura do pescoço com repicados internos. Dá corpo e movimento sem perder a estrutura.',
    'https://i.pinimg.com/736x/f5/fe/29/f5fe294a026ca252b16fdfb6eab958e5.jpg',
    [
      'https://i.pinimg.com/1200x/8e/f9/30/8ef93086d8b7f7754433ce6ca6e9d011.jpg',
      'https://i.pinimg.com/1200x/ed/80/40/ed8040ed4f0bcdb6c8ada69f3503f9c6.jpg',
      'https://i.pinimg.com/736x/84/57/ef/8457ef1450b5557e181cad27cd6f06a7.jpg',
      'https://i.pinimg.com/736x/af/3f/ab/af3fab13144b7ef5b5e77c8230b4f235.jpg',
      'https://i.pinimg.com/736x/4f/63/b4/4f63b42a1dbcf29bf0dad0590d5a6548.jpg',
      'https://i.pinimg.com/1200x/28/04/a4/2804a4eed55aff1f0a0ce1c3dbd4ef6f.jpg',
      'https://i.pinimg.com/1200x/0a/74/fe/0a74fee1be0245c8407f89a63a533019.jpg',
      'https://i.pinimg.com/1200x/90/27/0a/90270a5f82b31b3111e0be5a97be214b.jpg',
      'https://i.pinimg.com/1200x/b3/b2/3a/b3b23ae2980ee50d6a1d4ba922897237.jpg',
      'https://i.pinimg.com/1200x/8e/d8/bc/8ed8bcdab25ed919ae05c43dcd2113e0.jpg'
    ]
  ],
  ['wolf-cut', 'corte', 'Wolf Cut', 'Topo Volumoso',
    'Topo volumoso e curto que afina em camadas até a nuca. Visual selvagem e cheio de atitude.',
    'https://i.pinimg.com/736x/2a/eb/88/2aeb88213907101e1792b014a75fb4b3.jpg',
    [
      'https://i.pinimg.com/736x/e2/ab/f8/e2abf8b4b139df7b29c8551f40d4d338.jpg',
      'https://i.pinimg.com/736x/57/2d/3c/572d3c6920502f1be25599787049d8bb.jpg',
      'https://i.pinimg.com/236x/b0/e3/9a/b0e39ade429a2a9d8ccf5f031a254593.jpg',
      'https://i.pinimg.com/1200x/cd/d1/bc/cdd1bcedcf0c93e1b364951f1efe09c5.jpg',
      'https://i.pinimg.com/736x/1f/b4/8c/1fb48c1b6555ada907b50003ff1050b2.jpg',
      'https://i.pinimg.com/736x/5e/22/ea/5e22eaf62afedf7f86fb211ad5256732.jpg',
      'https://i.pinimg.com/1200x/4c/a5/fd/4ca5fdda0604d77487df8e9705a70ca9.jpg',
      'https://i.pinimg.com/736x/f7/0d/22/f70d22c7d042764647b586154d752271.jpg',
      'https://i.pinimg.com/1200x/73/5f/f2/735ff2faf255057979d4b640c0dc451b.jpg',
      'https://i.pinimg.com/1200x/4b/19/93/4b19933dfa61235577390ad03438181a.jpg'
    ]
  ],
  ['bixie-cut', 'corte', 'Bixie Cut', 'Híbrido Pixie-Bob',
    'Híbrido de pixie e bob: prático, desfiado e com movimento. Ideal para transição de cortes.',
    'https://i.pinimg.com/736x/4e/66/83/4e66838f18fe2212fa8ac412d9985447.jpg',
    [
      'https://i.pinimg.com/736x/ff/cb/e9/ffcbe9b68c10a9bf44b1610bbc6c3c0f.jpg',
      'https://i.pinimg.com/736x/24/39/90/243990bf81ae8af3e11281d755177fba.jpg',
      'https://i.pinimg.com/1200x/12/48/cb/1248cb0903da34be6111206cb6cf9468.jpg',
      'https://i.pinimg.com/736x/01/a2/3b/01a23b43d228aa31af028939a2ec9b06.jpg',
      'https://i.pinimg.com/736x/63/c7/3d/63c73d3104192776cc9ce37688722ef3.jpg',
      'https://i.pinimg.com/1200x/1d/20/2b/1d202bea3ca61a70ced6f540cb67ce5a.jpg',
      'https://i.pinimg.com/1200x/5a/5d/94/5a5d9491dd6cd02df00008a6344dd101.jpg',
      'https://i.pinimg.com/1200x/4d/c2/f8/4dc2f8b901e2a62ea2ae55d2f69d24a3.jpg',
      'https://i.pinimg.com/1200x/39/a5/6e/39a56e796c74efa0c601a48b8349e414.jpg',
      'https://i.pinimg.com/1200x/2d/1f/46/2d1f4608b8bfb22fddf1d34d834e436c.jpg'
    ]
  ],
  ['soft-layers', 'corte', 'Soft Layers', 'Camadas Longas',
    'Camadas longas e contínuas que dão movimento sem marcar divisões. Efeito natural e fluido.',
    'https://i.pinimg.com/1200x/e9/12/96/e91296a700072a42b4d9cfaafeb48ac7.jpg',
    [
      'https://i.pinimg.com/736x/96/31/54/96315450669e7b501f2c3a3df3d22c64.jpg',
      'https://i.pinimg.com/736x/3f/8a/56/3f8a567393a8ec2e33a032171cc9da1e.jpg',
      'https://i.pinimg.com/736x/53/a9/a9/53a9a9f6cae1b2cfbc439e44cba9b312.jpg',
      'https://i.pinimg.com/736x/28/08/b2/2808b20872bdf2f4d592937b832e5ebe.jpg',
      'https://i.pinimg.com/736x/e4/33/c6/e433c67d4a72a7e0db4c09264b1db14f.jpg',
      'https://i.pinimg.com/1200x/6e/4c/c7/6e4cc792bb849c411c7c45d4ade6a5ba.jpg',
      'https://i.pinimg.com/1200x/34/30/d8/3430d8b60e48812a8e1f15426af803f9.jpg',
      'https://i.pinimg.com/736x/43/c4/93/43c493fa3eff0cc7588e361d3df8af14.jpg',
      'https://i.pinimg.com/736x/9b/15/b9/9b15b9e256a6114b5148bee2650c1364.jpg',
      'https://i.pinimg.com/736x/23/ed/1a/23ed1a0d684e9c188c09ae26b62ff6cb.jpg'
    ]
  ],
  ['modern-mullet', 'corte', 'Modern Mullet', 'Laterais Curtas',
    'Laterais e topo curtos contrastando com comprimento alongado na nuca. Estilo ousado e moderno.',
    'https://i.pinimg.com/736x/20/58/ac/2058ac84b233324378f9e26d578ef819.jpg',
    [
      'https://i.pinimg.com/236x/e6/a1/82/e6a1828757f3ecd53a78bdd550faaba6.jpg',
      'https://i.pinimg.com/1200x/19/ed/cf/19edcf705faee3021dca36773177f62a.jpg',
      'https://i.pinimg.com/1200x/16/64/f9/1664f9eaac25d965bc1c2d6741fda93b.jpg',
      'https://i.pinimg.com/1200x/27/d6/74/27d674710090918e0690581ebc8ef94e.jpg',
      'https://i.pinimg.com/1200x/cb/f4/f1/cbf4f1161d464c832dbb5293dd8de964.jpg',
      'https://i.pinimg.com/1200x/f8/70/24/f87024c447ec39609515b2290aff08bc.jpg',
      'https://i.pinimg.com/1200x/60/66/10/60661058bc83960f7d1f317c12ad2431.jpg',
      'https://i.pinimg.com/1200x/b1/80/77/b180775bb03e74077fe9d8c43f680032.jpg',
      'https://i.pinimg.com/736x/ff/53/32/ff5332897dac5127e398a301e47784b3.jpg',
      'https://i.pinimg.com/1200x/2f/92/d0/2f92d0c3dcfaaaaaab163894bd4a611d.jpg'
    ]
  ],
  ['clavicut', 'corte', 'Clavicut', 'Altura da Clavícula',
    'Corte reto na altura da clavícula. Um médio versátil que combina com qualquer textura.',
    'https://i.pinimg.com/1200x/11/d9/e1/11d9e1a01d57ed8d1ea57700a636fa74.jpg',
    [
      'https://i.pinimg.com/736x/f6/fd/10/f6fd109767ac8c5eecc8eff4627a29b4.jpg',
      'https://i.pinimg.com/1200x/15/70/d8/1570d81bf27679068906d1bbec402541.jpg',
      'https://i.pinimg.com/736x/80/64/7b/80647beb8342644f1b0495329ae5dc5b.jpg',
      'https://i.pinimg.com/736x/a2/0c/66/a20c660ee91fd4fff2e840bcce525cc2.jpg',
      'https://i.pinimg.com/1200x/c8/33/f1/c833f10c4eecb915aca10301cf52eb4c.jpg',
      'https://i.pinimg.com/736x/b6/ba/71/b6ba71ea65fb533b1844d0049d7ac88c.jpg',
      'https://i.pinimg.com/736x/60/aa/9e/60aa9e7c143839c1649eff734c960da5.jpg',
      'https://i.pinimg.com/736x/f0/6f/91/f06f91f9f0acf8d1535fcac16cca7748.jpg',
      'https://i.pinimg.com/736x/b1/9a/be/b19abe36509b85262bb0ef929323b10f.jpg',
      'https://i.pinimg.com/736x/38/6b/70/386b70f42ee9c113ebd832de0b3d7af0.jpg'
    ]
  ],
  ['octopus-cut', 'corte', 'Octopus Cut', 'Topo Arredondado',
    'Topo arredondado e volumoso com camadas inferiores mais finas. Visual leve e cheio de personalidade.',
    'https://i.pinimg.com/1200x/99/a7/7c/99a77c4f583bad5a0d1c9319f44ade9b.jpg',
    [
      'https://i.pinimg.com/1200x/fe/b3/81/feb381a2026228724751dcf1770a61b8.jpg',
      'https://i.pinimg.com/736x/4e/ad/cc/4eadcc3c07ced2c32c6093d75c1667ff.jpg',
      'https://i.pinimg.com/736x/0c/9c/67/0c9c6782b990579ddbbe6fc28d341d75.jpg',
      'https://i.pinimg.com/1200x/3d/93/f6/3d93f6733e2577b5e83f98cbbdacfe9f.jpg',
      'https://i.pinimg.com/1200x/5d/48/92/5d489219e20ed97dabc8cfe59d1c0dcf.jpg',
      'https://i.pinimg.com/736x/00/71/f6/0071f65ebd3e8a6181c4c895462c9ba9.jpg',
      'https://i.pinimg.com/736x/c4/27/f5/c427f51e5840551ca2d5a42e38186485.jpg',
      'https://i.pinimg.com/1200x/30/9e/cb/309ecbbff1f7dff8b7fa402be710c0b1.jpg',
      'https://i.pinimg.com/736x/f6/fa/f4/f6faf40de98db74e25d1355ef012510c.jpg',
      'https://i.pinimg.com/736x/3c/f7/25/3cf7255b744af3c6fad16b48929493b7.jpg'
    ]
  ],
  ['hush-cut', 'corte', 'Hush Cut', 'Camadas Profundas',
    'Camadas profundas e leves com franja transparente. Corte suave e de acabamento natural.',
    'https://i.pinimg.com/736x/7c/1b/0b/7c1b0bae28ed1074ae441064c1d40b0b.jpg',
    [
      'https://i.pinimg.com/236x/27/65/7d/27657de35a3184d3bb88750265351f1e.jpg',
      'https://i.pinimg.com/736x/b0/2f/4f/b02f4f74b719d47b218c06dc1f19c224.jpg',
      'https://i.pinimg.com/736x/f0/8c/0e/f08c0e6a8009f431e0cee00ade8e28bb.jpg',
      'https://i.pinimg.com/736x/f5/db/b9/f5dbb925a567194db137be17148fb9af.jpg',
      'https://i.pinimg.com/736x/49/f2/5a/49f25a25d31fd2f7b8dca3f219559d9f.jpg',
      'https://i.pinimg.com/736x/2c/ff/3e/2cff3e43ed7e8559602509e135fc826b.jpg',
      'https://i.pinimg.com/736x/72/5f/a5/725fa532477651a17bcc070cd6d63c43.jpg',
      'https://i.pinimg.com/1200x/24/53/f0/2453f0e489e216491e4374d646bff696.jpg',
      'https://i.pinimg.com/1200x/d2/59/a6/d259a609279b2ede2980f3ee128d733f.jpg',
      'https://i.pinimg.com/1200x/87/7c/dd/877cddceab43b6a2b126e00b1f5c1ccf.jpg'
    ]
  ],
  ['curtain-bang', 'corte', 'Curtain Bang', 'Franja Cortininha',
    'Franja dividida ao meio que abre como uma cortina, emoldurando o rosto suavemente.',
    'https://i.pinimg.com/736x/c7/83/c4/c783c422b3a1b9b4a980b2c3a472118f.jpg',
    [
      'https://i.pinimg.com/736x/ac/71/25/ac7125df02150a4f398ba23f8cb8e343.jpg',
      'https://i.pinimg.com/736x/00/36/fc/0036fc75d702f60260c763706898f947.jpg',
      'https://i.pinimg.com/736x/e1/69/0a/e1690a55e7cc557de8fc4d8d9a29b171.jpg',
      'https://i.pinimg.com/736x/a0/07/f5/a007f51006c175ee7019d7ba8922029f.jpg',
      'https://i.pinimg.com/1200x/10/75/c6/1075c68d4b35292480d95cea2225915f.jpg',
      'https://i.pinimg.com/1200x/8e/9b/88/8e9b8865119a4916a22b3546005dfe22.jpg',
      'https://i.pinimg.com/736x/2b/58/8f/2b588f820afd53270b38996609f090a8.jpg',
      'https://i.pinimg.com/736x/55/04/99/550499a1e9250d771ae1a51ce23eccd1.jpg',
      'https://i.pinimg.com/736x/11/1c/77/111c7701a0ceed64db41619a6041f7c8.jpg',
      'https://i.pinimg.com/736x/0d/0b/4f/0d0b4f4411cb47ae50337399c55bf918.jpg',
      'https://i.pinimg.com/236x/0c/53/77/0c53779e821b89d4fd13555db779b783.jpg'
    ]
  ],
  ['parisian-fringe', 'corte', 'Parisian Fringe', 'Bob Arredondado com Franja Texturizada',
    'Bob arredondado na altura do queixo com franja texturizada, inspirado no estilo parisiense. Chique, moderno e atemporal.',
    'https://i.pinimg.com/1200x/f3/90/60/f39060b00b2661fd7c071a5d47bbbc09.jpg',
    [
      'https://i.pinimg.com/736x/43/c4/cc/43c4cc25480f779f66f7e2d2139d58f4.jpg',
      'https://i.pinimg.com/736x/78/d1/d4/78d1d43657dd0bbe8af73e9d27e4ae3e.jpg',
      'https://i.pinimg.com/736x/f3/e2/47/f3e24722fa5a0a41cab26cf07e35d5b0.jpg',
      'https://i.pinimg.com/736x/38/c4/69/38c4697c7756863f4bb682b0365b406e.jpg',
      'https://i.pinimg.com/736x/cb/5f/2e/cb5f2ed5996ba12a3d627eeb89a59143.jpg',
      'https://i.pinimg.com/736x/32/e0/0c/32e00c7e6dd5808b20f1f501d03c9eb8.jpg',
      'https://i.pinimg.com/736x/95/7d/ce/957dce3168b0b28a7fa887a318123426.jpg',
      'https://i.pinimg.com/736x/e0/1f/a7/e01fa757da495954e11a7d564aa36621.jpg',
      'https://i.pinimg.com/736x/b1/d5/e8/b1d5e8d496be0aa0d9033e1742d91831.jpg',
      'https://i.pinimg.com/736x/0f/17/97/0f1797b50fa870d18d32c417b460677f.jpg'
    ]
  ],
  ['milano-layered', 'corte', 'Milano Layered', 'Camadas Longas com Brilho Espelhado',
    'Camadas longas com caimento pesado, denso e brilho espelhado, inspirado no estilo milanês. Sofisticado e elegante.',
    'https://i.pinimg.com/736x/e4/a2/98/e4a2980910025f69802da870b53d03db.jpg',
    [
      'https://i.pinimg.com/736x/02/6a/7f/026a7f2e233dcdbfd69213ced0a499d2.jpg',
      'https://i.pinimg.com/736x/c2/8b/50/c28b50596ad8708dc1af2bd12ca5f950.jpg',
      'https://i.pinimg.com/736x/17/6b/7c/176b7ca842d4f05fc232e6c4950fb67d.jpg',
      'https://i.pinimg.com/736x/6a/c1/97/6ac197acb1d9a35650cda0d7b221e3bb.jpg',
      'https://i.pinimg.com/736x/56/44/aa/5644aa042553d9be35f7f0f92a9ea046.jpg',
      'https://i.pinimg.com/736x/88/27/2c/88272c86c739b50408bc6372972a7dba.jpg',
      'https://i.pinimg.com/736x/cb/5b/bd/cb5bbde7a812d11c8b856ddfad8037c6.jpg',
      'https://i.pinimg.com/736x/ba/47/41/ba4741fa467ada18d1e9662f8940bd6f.jpg',
      'https://i.pinimg.com/736x/a7/fa/d7/a7fad7690ef102971c469596a26464c0.jpg',
      'https://i.pinimg.com/736x/45/84/d0/4584d0c441b4c7059f4dd1fd6e02046c.jpg'
    ]
  ],
  ['brazilian-beach-wave', 'corte', 'Brazilian Beach Wave', 'Long Bob com Ondas Tropicais',
    'Long bob com ondas largas, movimento tropical e textura desestruturada. Inspirado nas praias brasileiras.',
    'https://i.pinimg.com/1200x/18/58/1f/18581fff007bf6dae432d4d9ed75f6ad.jpg',
    [
      'https://i.pinimg.com/236x/78/1a/5c/781a5cc85cf1c9e7f85d6c6427b8d7d3.jpg',
      'https://i.pinimg.com/1200x/22/9d/37/229d374a868553d84e23ca964759d667.jpg',
      'https://i.pinimg.com/736x/b6/ba/71/b6ba71ea65fb533b1844d0049d7ac88c.jpg',
      'https://i.pinimg.com/736x/8e/c2/dd/8ec2dda6ef4765196da9032189869f96.jpg',
      'https://i.pinimg.com/736x/b8/89/cd/b889cd20676ddc7383f41c664f5c438f.jpg',
      'https://i.pinimg.com/736x/d8/cc/c8/d8ccc81b421dd3ca7e826b2b3b5a43a8.jpg',
      'https://i.pinimg.com/1200x/aa/32/14/aa3214cb72ff73e82a5744f7c8b33472.jpg',
      'https://i.pinimg.com/736x/0b/2d/93/0b2d931ab971830cd0b3adcec64c6a08.jpg',
      'https://i.pinimg.com/736x/eb/b4/fd/ebb4fdc9371ef33e2b78585cbbcd892c.jpg',
      'https://i.pinimg.com/1200x/04/9c/03/049c03a989436455996c8d3b7833d945.jpg'
    ]
  ],
  ['riviera-pixie', 'corte', 'Riviera Pixie', 'Pixie com Topo Longo e Maleável',
    'Pixie com nuca e laterais bem curtas contrastando com um topo longo, maleável e versátil. Inspirado na Riviera.',
    'https://i.pinimg.com/1200x/f8/a9/c5/f8a9c55929c8099041078b816afaf6de.jpg',
    [
      'https://i.pinimg.com/736x/6b/60/c0/6b60c0d06ef711d77012ae907d0ea7a2.jpg',
      'https://i.pinimg.com/736x/a8/b6/b1/a8b6b108b2d2abe9284ae33bf370d669.jpg',
      'https://i.pinimg.com/1200x/fc/95/a9/fc95a9d29faf38bff61c3e40bf7917ca.jpg',
      'https://i.pinimg.com/736x/05/14/ad/0514ad5b3d2286ae019aa9ef7e53e865.jpg',
      'https://i.pinimg.com/736x/fa/6d/53/fa6d537810d8634f00bb414ae0c0481a.jpg',
      'https://i.pinimg.com/1200x/6f/7e/c7/6f7ec7a1b2ba40d419099845cbf5328a.jpg',
      'https://i.pinimg.com/736x/f7/af/43/f7af431573187012710a842f71ed8017.jpg',
      'https://i.pinimg.com/1200x/35/e9/b4/35e9b4608515d54c045855be3a890768.jpg',
      'https://i.pinimg.com/1200x/1f/52/79/1f527930458ad3122be76c324b3f4dd1.jpg',
      'https://i.pinimg.com/736x/08/79/77/087977d38daafff023d115da707a257e.jpg'
    ]
  ],
  // ===== NOVOS CORTES — 1ª LEVA (5) =====
  ['bob-desfiado', 'corte', 'Bob Desfiado', 'Long Bob com Textura',
    'Long bob com pontas desfiadas e camadas leves. Cria movimento natural e remove o peso excessivo, ideal para cabelos médios que buscam leveza.',
    'https://i.pinimg.com/736x/8e/c2/dd/8ec2dda6ef4765196da9032189869f96.jpg',
    [
      'https://i.pinimg.com/736x/8e/c2/dd/8ec2dda6ef4765196da9032189869f96.jpg',
      'https://i.pinimg.com/736x/b8/89/cd/b889cd20676ddc7383f41c664f5c438f.jpg',
      'https://i.pinimg.com/736x/d8/cc/c8/d8ccc81b421dd3ca7e826b2b3b5a43a8.jpg',
      'https://i.pinimg.com/1200x/aa/32/14/aa3214cb72ff73e82a5744f7c8b33472.jpg',
      'https://i.pinimg.com/736x/0b/2d/93/0b2d931ab971830cd0b3adcec64c6a08.jpg',
      'https://i.pinimg.com/736x/eb/b4/fd/ebb4fdc9371ef33e2b78585cbbcd892c.jpg',
      'https://i.pinimg.com/1200x/04/9c/03/049c03a989436455996c8d3b7833d945.jpg',
      'https://i.pinimg.com/236x/78/1a/5c/781a5cc85cf1c9e7f85d6c6427b8d7d3.jpg',
      'https://i.pinimg.com/1200x/22/9d/37/229d374a868553d84e23ca964759d667.jpg',
      'https://i.pinimg.com/736x/b6/ba/71/b6ba71ea65fb533b1844d0049d7ac88c.jpg'
    ]
  ],
  ['curly-shag', 'corte', 'Curly Shag', 'Camadas para Cacheados',
    'Shag adaptado para cabelos cacheados e ondulados. Camadas desconectadas que valorizam a curvatura natural e criam volume controlado.',
    'https://i.pinimg.com/736x/2a/eb/88/2aeb88213907101e1792b014a75fb4b3.jpg',
    [
      'https://i.pinimg.com/736x/2a/eb/88/2aeb88213907101e1792b014a75fb4b3.jpg',
      'https://i.pinimg.com/736x/e2/ab/f8/e2abf8b4b139df7b29c8551f40d4d338.jpg',
      'https://i.pinimg.com/736x/57/2d/3c/572d3c6920502f1be25599787049d8bb.jpg',
      'https://i.pinimg.com/236x/b0/e3/9a/b0e39ade429a2a9d8ccf5f031a254593.jpg',
      'https://i.pinimg.com/1200x/cd/d1/bc/cdd1bcedcf0c93e1b364951f1efe09c5.jpg',
      'https://i.pinimg.com/736x/1f/b4/8c/1fb48c1b6555ada907b50003ff1050b2.jpg',
      'https://i.pinimg.com/736x/5e/22/ea/5e22eaf62afedf7f86fb211ad5256732.jpg',
      'https://i.pinimg.com/1200x/4c/a5/fd/4ca5fdda0604d77487df8e9705a70ca9.jpg',
      'https://i.pinimg.com/736x/f7/0d/22/f70d22c7d042764647b586154d752271.jpg',
      'https://i.pinimg.com/1200x/73/5f/f2/735ff2faf255057979d4b640c0dc451b.jpg'
    ]
  ],
  ['micro-bob', 'corte', 'Micro Bob', 'Chanel Minimalista',
    'Bob curtíssimo na altura da mandíbula ou acima. Minimalista, ousado e de baixa manutenção, com acabamento preciso e moderno.',
    'https://i.pinimg.com/1200x/fa/83/3a/fa833a9f5008d52cbf0f86a0665bbe15.jpg',
    [
      'https://i.pinimg.com/1200x/fa/83/3a/fa833a9f5008d52cbf0f86a0665bbe15.jpg',
      'https://i.pinimg.com/736x/dd/80/09/dd80099cba2352f7f65c919016a5dbe1.jpg',
      'https://i.pinimg.com/736x/e0/df/ae/e0dfaebb413bd160699c30d24725a3fe.jpg',
      'https://i.pinimg.com/736x/55/45/71/5545719a22d414ab9294aa7baa9e4fff.jpg',
      'https://i.pinimg.com/736x/35/17/da/3517da17cfe29e89c2d7eb754df86ac9.jpg',
      'https://i.pinimg.com/736x/db/f7/9e/dbf79ed817e0b975c55cb26dbd34e429.jpg',
      'https://i.pinimg.com/736x/4a/3e/83/4a3e831657711fc4dc97a197a4f1a999.jpg',
      'https://i.pinimg.com/736x/66/64/19/666419699950d29fb4e1d8c7f5856acf.jpg',
      'https://i.pinimg.com/736x/47/44/7a/47447a0b919613631d537b2b80e8f319.jpg',
      'https://i.pinimg.com/736x/98/6f/3b/986f3b7f6ece364be7d82c4748a47d19.jpg'
    ]
  ],
  ['wavy-bob', 'corte', 'Wavy Bob', 'Long Bob Ondulado',
    'Long bob com ondas naturais e camadas suaves. Perfeito para cabelos ondulados que buscam um visual elegante e despretensioso.',
    'https://i.pinimg.com/1200x/18/58/1f/18581fff007bf6dae432d4d9ed75f6ad.jpg',
    [
      'https://i.pinimg.com/1200x/18/58/1f/18581fff007bf6dae432d4d9ed75f6ad.jpg',
      'https://i.pinimg.com/236x/78/1a/5c/781a5cc85cf1c9e7f85d6c6427b8d7d3.jpg',
      'https://i.pinimg.com/1200x/22/9d/37/229d374a868553d84e23ca964759d667.jpg',
      'https://i.pinimg.com/736x/b6/ba/71/b6ba71ea65fb533b1844d0049d7ac88c.jpg',
      'https://i.pinimg.com/736x/8e/c2/dd/8ec2dda6ef4765196da9032189869f96.jpg',
      'https://i.pinimg.com/736x/b8/89/cd/b889cd20676ddc7383f41c664f5c438f.jpg',
      'https://i.pinimg.com/736x/d8/cc/c8/d8ccc81b421dd3ca7e826b2b3b5a43a8.jpg',
      'https://i.pinimg.com/1200x/aa/32/14/aa3214cb72ff73e82a5744f7c8b33472.jpg',
      'https://i.pinimg.com/736x/0b/2d/93/0b2d931ab971830cd0b3adcec64c6a08.jpg',
      'https://i.pinimg.com/736x/eb/b4/fd/ebb4fdc9371ef33e2b78585cbbcd892c.jpg'
    ]
  ],
  ['layered-pixie', 'corte', 'Layered Pixie', 'Pixie com Camadas Longas',
    'Pixie com camadas mais longas no topo e laterais. Versátil, permite modelar de diferentes formas e cresce com elegância.',
    'https://i.pinimg.com/736x/f9/ff/75/f9ff7537091c6e00b3f1415474f6ec12.jpg',
    [
      'https://i.pinimg.com/1200x/f8/a9/c5/f8a9c55929c8099041078b816afaf6de.jpg',
      'https://i.pinimg.com/736x/6b/60/c0/6b60c0d06ef711d77012ae907d0ea7a2.jpg',
      'https://i.pinimg.com/736x/a8/b6/b1/a8b6b108b2d2abe9284ae33bf370d669.jpg',
      'https://i.pinimg.com/1200x/fc/95/a9/fc95a9d29faf38bff61c3e40bf7917ca.jpg',
      'https://i.pinimg.com/736x/05/14/ad/0514ad5b3d2286ae019aa9ef7e53e865.jpg',
      'https://i.pinimg.com/736x/fa/6d/53/fa6d537810d8634f00bb414ae0c0481a.jpg',
      'https://i.pinimg.com/1200x/6f/7e/c7/6f7ec7a1b2ba40d419099845cbf5328a.jpg',
      'https://i.pinimg.com/736x/f7/af/43/f7af431573187012710a842f71ed8017.jpg',
      'https://i.pinimg.com/1200x/35/e9/b4/35e9b4608515d54c045855be3a890768.jpg',
      'https://i.pinimg.com/1200x/1f/52/79/1f527930458ad3122be76c324b3f4dd1.jpg'
    ]
  ],
  // ===== NOVOS CORTES — 2ª LEVA · ALTA ALFAIATARIA (5) =====
  ['kitty-cut', 'corte', 'Kitty Cut', 'Bob-Shag Fluido na Altura dos Ombros',
    'Meio-termo sofisticado entre o bob e o shag. Linha de base reta na altura dos ombros com camadas internas suaves e desconectadas que só se revelam no movimento. Caimento fluido e pendular, com moldura frontal que ilumina os traços. Ideal para quem busca elegância contemporânea sem abrir mão da leveza.',
    'https://i.pinimg.com/1200x/14/1c/a1/141ca123597b6962ddde805e87d9d0d3.jpg',
    [
      'https://i.pinimg.com/736x/6c/73/a4/6c73a4e52df16ad5a56b701ad63b37b2.jpg',
      'https://i.pinimg.com/736x/02/d2/ad/02d2adc1433a0b74f7f1c27ecd9a3e7f.jpg',
      'https://i.pinimg.com/736x/02/3e/27/023e27ef76fa501e627b07389efe7d99.jpg',
      'https://i.pinimg.com/736x/92/0e/01/920e013dd5bae141dccdac33c3bb6a5b.jpg',
      'https://i.pinimg.com/1200x/24/ec/e1/24ece1826fc5b814072cf090bff9c86e.jpg',
      'https://i.pinimg.com/736x/05/18/88/05188821bb2b5bfaf65cc303ce4e6b28.jpg',
      'https://i.pinimg.com/1200x/d3/51/06/d35106b0a9e94122641f383b7e40a391.jpg',
      'https://i.pinimg.com/736x/4b/d6/15/4bd615722ed82b1b4214ace23965a7b5.jpg',
      'https://i.pinimg.com/736x/e8/2a/91/e82a91fb3b2015536d8a348714141b1f.jpg',
      'https://i.pinimg.com/736x/44/a5/5a/44a55a3e2482ac313cc34e9c3af37145.jpg'
    ]
  ],
  ['side-cut', 'corte', 'Side Cut', 'Desconexão Lateral com Contraste Marcado',
    'Corte ousado com uma das laterais raspadas, gerando forte contraste e atitude urbana. Estrutura assimétrica com ponto de desconexão vertical e linha levemente curvada. O lado longo cria uma cortina de cabelo que pode ser jogada sobre a lateral raspada, criando jogo de forças e efeito meia-lua. Perfeito para quem tem maxilar definido e quer uma declaração estética.',
    'https://i.pinimg.com/1200x/de/4d/24/de4d244b7955694a245cfdb0d916a70c.jpg',
    [
      'https://i.pinimg.com/1200x/dd/33/25/dd3325325c0c52ff69a73cf687686e7f.jpg',
      'https://i.pinimg.com/736x/0b/4e/b0/0b4eb0e120545c32c4511a7b3b5cbb95.jpg',
      'https://i.pinimg.com/1200x/70/b0/3b/70b03bac67d866dde1a30f2f17928cc9.jpg',
      'https://i.pinimg.com/1200x/0c/48/3e/0c483e956a923ef406a14e970cd490b7.jpg',
      'https://i.pinimg.com/1200x/4d/1a/1a/4d1a1a3015b58eaf00bf56f09fdbd1f9.jpg',
      'https://i.pinimg.com/736x/ca/0e/93/ca0e93cc463fd03fff7db794ae1994af.jpg',
      'https://i.pinimg.com/236x/b4/2e/96/b42e9601015195a7057613d43724dae0.jpg',
      'https://i.pinimg.com/1200x/3a/8c/00/3a8c000a3265e2c72db69da805857bca.jpg',
      'https://i.pinimg.com/1200x/0d/0b/a0/0d0ba0d75b7b23bf945cc9b91c588dab.jpg',
      'https://i.pinimg.com/1200x/3a/a8/9f/3aa89f20df0421b46aeedc5d4bbcb10c.jpg'
    ]
  ],
  ['long-pixie', 'corte', 'Long Pixie', 'Pixie com Zonas Alta e Frontal Alongadas',
    'Evolução do pixie tradicional com zonas alta e frontal mais longas, garantindo versatilidade e volume maleável. Estrutura em três zonas com transição calculada: nuca curta com graduação fechada, parietais intermediários e topo longo que pode ser jogado para trás, dividido ao meio ou texturizado para frente. Peso invertido concentrado no topo cria movimento e permite penteados variados. Crescimento elegante.',
    'https://i.pinimg.com/1200x/db/4f/81/db4f816a70651d7b8864a9ff79df6acb.jpg',
    [
      'https://i.pinimg.com/736x/fc/c5/68/fcc568fcce15a692ef2eafce1d4e21af.jpg',
      'https://i.pinimg.com/736x/94/82/6f/94826f9fe637a42381f75525b307d87f.jpg',
      'https://i.pinimg.com/736x/66/39/15/66391544dabf1459a61a878f9e63a70e.jpg',
      'https://i.pinimg.com/1200x/fe/e3/cd/fee3cd37d023a8ef22a96b6a37b3539e.jpg',
      'https://i.pinimg.com/736x/47/b3/fb/47b3fb31012603b107d18a14a775b4ab.jpg',
      'https://i.pinimg.com/736x/61/48/e7/6148e7c2a443c6f5afe1fbfadbbda8a5.jpg',
      'https://i.pinimg.com/736x/65/78/b3/6578b3b6059c7f259d402de2b93ddb3f.jpg',
      'https://i.pinimg.com/1200x/2a/e6/4b/2ae64b5f9a21eb8d7fa0d57528851a2a.jpg',
      'https://i.pinimg.com/1200x/9a/d2/1e/9ad21e5dde1d86da9bcd051e29cecdee.jpg',
      'https://i.pinimg.com/1200x/fc/39/d6/fc39d673b0eaaba1709b3f32a2951b56.jpg'
    ]
  ],
  ['curly-bob', 'corte', 'Curly Bob', 'Bob Cacheado Arredondado',
    'Bob cacheado com volume arredondado e cachos definidos que emolduram o rosto. Corte na altura do queixo ou maxilar que valoriza a curvatura natural dos fios, criando um visual elegante, moderno e cheio de personalidade. Ideal para cabelos cacheados e ondulados que buscam um corte estruturado sem perder o movimento natural dos cachos.',
    'https://i.pinimg.com/736x/1b/b9/46/1bb9462f667f122ff09fbf65e46105e1.jpg',
    [
      'https://i.pinimg.com/736x/d5/8b/68/d58b688061c24a0c99820580c0046d3f.jpg',
      'https://i.pinimg.com/736x/d2/70/9f/d2709f314728cbf66039a6dbe69c451a.jpg',
      'https://i.pinimg.com/1200x/ed/9c/9f/ed9c9f657706a7ba3a62d53601371202.jpg',
      'https://i.pinimg.com/736x/a7/8a/e2/a78ae223933fef1a092cbe01a9c22a16.jpg',
      'https://i.pinimg.com/736x/76/0c/4b/760c4be9742c6450afc0eeb63700a39c.jpg',
      'https://i.pinimg.com/736x/dc/96/54/dc9654250bf4f72c028310d5911dde09.jpg',
      'https://i.pinimg.com/736x/fb/ef/6e/fbef6eecc64d0787e0065e001962ac8f.jpg',
      'https://i.pinimg.com/736x/2d/69/24/2d6924d08fd1c0e12b9e3e01537bb585.jpg',
      'https://i.pinimg.com/1200x/08/37/04/083704ac74c7e0a8c08735ea45469e90.jpg',
      'https://i.pinimg.com/736x/30/6a/98/306a9837d67ea1def17c30d76f2ef76d.jpg'
    ]
  ],
  ['asymmetric-cut', 'corte', 'Asymmetric Cut', 'Corte Assimétrico com Lados Diferentes',
    'Corte com lados deliberadamente diferentes, criando contraste e movimento assimétrico. Um lado pode ser mais curto ou ter camadas distintas do outro, resultando em um visual moderno, ousado e cheio de personalidade. A assimetria pode ser sutil (diferença de comprimento) ou marcada (desconexão visível), adaptando-se a diferentes estilos. Perfeito para quem quer sair do convencional e criar um look único e cheio de atitude.',
    'https://i.pinimg.com/236x/de/f5/a3/def5a3a55b260e9e25250fa02efc9a97.jpg',
    [
      'https://i.pinimg.com/736x/6d/cd/16/6dcd166e935626302ca928759ddd33dd.jpg',
      'https://i.pinimg.com/736x/5b/ac/23/5bac230abb25c3a9dd94c4ad2344c33a.jpg',
      'https://i.pinimg.com/736x/3f/11/27/3f1127de905277a8483583ea6c16243a.jpg',
      'https://i.pinimg.com/1200x/f2/9e/1b/f29e1b5b8016562281007ad2e5391740.jpg',
      'https://i.pinimg.com/1200x/0a/18/77/0a18779bcfebf97444ddfdb9f0d76fbf.jpg',
      'https://i.pinimg.com/736x/4e/37/57/4e3757c1e8b80a5d625dd96b02de392f.jpg',
      'https://i.pinimg.com/736x/da/88/e1/da88e17a8339b416035bc33d6878199a.jpg',
      'https://i.pinimg.com/1200x/51/7c/58/517c5886bdbe74eed2cdea41680a5f80.jpg',
      'https://i.pinimg.com/1200x/96/54/84/965484971ae65dfe821188da0cce63d1.jpg',
      'https://i.pinimg.com/1200x/c0/58/24/c058246ac282d0506c17ed59ca940f8e.jpg'
    ]
  ]
];

// ============================================================
// DADOS: COLORAÇÕES (20 itens)
// ============================================================
var coloracoesData = [
  ['ombre-tiger-eye', 'coloracao', 'Ombré Tiger Eye', 'Transição Dourada',
    'Transição suave do escuro para o dourado. Efeito olho de tigre. Ex.: base 5.0/6.0 + mechas 8.3/9.3 (dourado).',
    'https://i.pinimg.com/1200x/fc/77/96/fc7796a5b8212a0fd41f43792ede5351.jpg',
    [
      'https://i.pinimg.com/1200x/fc/77/96/fc7796a5b8212a0fd41f43792ede5351.jpg',
      'https://i.pinimg.com/736x/45/26/d3/4526d3bd85f723c62b5d376a21575ae5.jpg',
      'https://i.pinimg.com/736x/80/f3/bb/80f3bbce1fb5bb37fd8c921cd8ada7d2.jpg',
      'https://i.pinimg.com/736x/45/9c/a1/459ca1eba3cc70bc50f8414b1490a0b0.jpg',
      'https://i.pinimg.com/736x/cd/3c/0e/cd3c0ef3f5b2a4ec9c4e8b1e110b46ba.jpg',
      'https://i.pinimg.com/736x/81/b3/e3/81b3e38fcd2c99d11e48657daad65c74.jpg',
      'https://i.pinimg.com/236x/3c/ef/b5/3cefb5c8bcf36f31e91ccad6f55c79f5.jpg',
      'https://i.pinimg.com/736x/2b/93/62/2b936201040763501177f1cc4c1106c3.jpg',
      'https://i.pinimg.com/736x/ca/96/e9/ca96e93dd930794dfc51755adcc831bf.jpg',
      'https://i.pinimg.com/736x/41/c0/6d/41c06d6ed54a7b4605c5aa131a7b14b7.jpg'
    ]
  ],
  ['babylights-morena', 'coloracao', 'Babylights Morena', 'Luzes Finíssimas',
    'Luzes finíssimas que imitam o efeito natural do sol. Ex.: base 4.0/5.0 + babylights 7.3/8.3 (caramelo dourado).',
    'https://i.pinimg.com/1200x/37/c9/1c/37c91cbb94c03b8a37157bf367a3dfbc.jpg',
    [
      'https://i.pinimg.com/736x/69/c8/3b/69c83bfd72fd3022f6a6dc49b2b3f232.jpg',
      'https://i.pinimg.com/1200x/66/33/b3/6633b3d5f27363ed895a7cb870e20c78.jpg',
      'https://i.pinimg.com/736x/dd/7d/8e/dd7d8e39cea64d3f335fe067c8dd14b2.jpg',
      'https://i.pinimg.com/736x/f6/17/b5/f617b5b262544bb7a6f482f18d362487.jpg',
      'https://i.pinimg.com/1200x/e4/4b/da/e44bdac8a5105bfec972ba9a543bfeec.jpg',
      'https://i.pinimg.com/736x/0e/dc/3a/0edc3a3d742bbce816f8a7b9948c3422.jpg',
      'https://i.pinimg.com/736x/6e/08/7f/6e087fe54324ae27e3179a1f51db537c.jpg',
      'https://i.pinimg.com/736x/62/56/a8/6256a87f0bc5ce4ad04e5008e3e75c3c.jpg',
      'https://i.pinimg.com/736x/04/72/2d/04722d69e14755a8c25950f0da9adff3.jpg',
      'https://i.pinimg.com/1200x/b3/4a/0b/b34a0be19ad5436bcfd2dea58da00f6e.jpg'
    ]
  ],
  ['contour-highlights', 'coloracao', 'Contour Highlights', 'Luzes Estratégicas',
    'Luzes estratégicas que valorizam o formato do rosto. Ex.: contorno facial 8.3/9.0 ou 7.3 + 8.0.',
    'https://i.pinimg.com/736x/a2/8b/0d/a28b0d206e5cc72f3ba38aafa9ad8031.jpg',
    [
      'https://i.pinimg.com/736x/81/cf/e1/81cfe196df3e580425a842f6af8f12e3.jpg',
      'https://i.pinimg.com/736x/30/0a/83/300a83dfb89f41edbeb57061216538f4.jpg',
      'https://i.pinimg.com/1200x/41/4f/e3/414fe3a069ba01def6a66d44ac222636.jpg',
      'https://i.pinimg.com/1200x/7f/35/f9/7f35f9d6ed44ca283c69bb674019aa2d.jpg',
      'https://i.pinimg.com/736x/56/3a/da/563ada1310e02123d3c9d1c64f102693.jpg',
      'https://i.pinimg.com/736x/4c/e8/9f/4ce89fee713b38688226ea540639b201.jpg',
      'https://i.pinimg.com/736x/7c/e6/f9/7ce6f9523c7282634f3a2adcb4e2cdd8.jpg',
      'https://i.pinimg.com/1200x/0e/bb/1f/0ebb1f1251107bde521cc59d5fc1b116.jpg',
      'https://i.pinimg.com/736x/ad/b1/ff/adb1ffeb0f07b5696705dae265aaff22.jpg',
      'https://i.pinimg.com/1200x/aa/cb/cf/aacbcffaf13927ee047eabcbda8cc1aa.jpg'
    ]
  ],
  ['balayage-loira', 'coloracao', 'Balayage Loira', 'Luzes Naturais',
    'Técnica de luzes naturais com efeito degradê e movimento. Ex.: base 6.0/7.0 + balayage 8.3/9.3 + gloss 9.0.',
    'https://i.pinimg.com/736x/67/53/d4/6753d4546e18a5b6e121879b4e45a5f5.jpg',
    [
      'https://i.pinimg.com/736x/67/53/d4/6753d4546e18a5b6e121879b4e45a5f5.jpg',
      'https://i.pinimg.com/1200x/9c/38/2e/9c382e31a4eaafd69ce5d685d82f238b.jpg',
      'https://i.pinimg.com/1200x/85/03/4b/85034b9e76143badec90e47cdac4ae36.jpg',
      'https://i.pinimg.com/1200x/bf/f2/4b/bff24b95458ec3242c742d7c7014996b.jpg',
      'https://i.pinimg.com/736x/b2/70/53/b27053d5918d3a819f9e48f0b864cb56.jpg',
      'https://i.pinimg.com/736x/69/81/cb/6981cbf1d971c00a4a4268120a2199be.jpg',
      'https://i.pinimg.com/1200x/a6/2c/4e/a62c4e52baecfd4e5a0cb7203b7c6dd9.jpg',
      'https://i.pinimg.com/736x/92/b3/fa/92b3fad62db6657d1d34725075a9cc0d.jpg',
      'https://i.pinimg.com/1200x/71/91/a0/7191a072c196f845426a91c111b5757b.jpg',
      'https://i.pinimg.com/736x/4f/4c/c3/4f4cc384ba311066a815ec3ba62db5af.jpg'
    ]
  ],
  ['californianas', 'coloracao', 'Californianas', 'Efeito Sol',
    'Luzes que criam um efeito de sol californiano. Ex.: base 5.0/6.0 + pontas 8.3/9.3 (dourado quente).',
    'https://i.pinimg.com/736x/c7/92/25/c7922574476f525938331938daf277f7.jpg',
    [
      'https://i.pinimg.com/736x/c7/92/25/c7922574476f525938331938daf277f7.jpg',
      'https://i.pinimg.com/736x/9b/30/3c/9b303c2040de9482f8391090b7cf8cfa.jpg',
      'https://i.pinimg.com/1200x/80/f3/bb/80f3bbce1fb5bb37fd8c921cd8ada7d2.jpg',
      'https://i.pinimg.com/736x/99/a0/1b/99a01b1ffd110e8e7fcadf5876a06dc7.jpg',
      'https://i.pinimg.com/1200x/9d/f8/60/9df860fa26577c0589865d7e85eaded1.jpg',
      'https://i.pinimg.com/736x/68/75/32/68753259a972205ad340a4a45186bce7.jpg',
      'https://i.pinimg.com/236x/0a/1e/b2/0a1eb224c389443cbcba956be1b3afc9.jpg',
      'https://i.pinimg.com/736x/67/55/9b/67559bf4b3891156ca4ea79c89f1a538.jpg',
      'https://i.pinimg.com/736x/6f/eb/38/6feb38fbbd82b0f67ed85dc10da2012f.jpg',
      'https://i.pinimg.com/736x/ce/af/83/ceaf83e5c53995750f53dacccb66f162.jpg'
    ]
  ],
  ['mechas-contour', 'coloracao', 'Mechas Contour', 'Contorno Facial',
    'Luzes que contornam o rosto, iluminando e valorizando. Ex.: mechas frontais 8.0/9.0 ou 8.3 + 9.0.',
    'https://i.pinimg.com/1200x/05/42/66/05426622b672a5271cdfcd4813595269.jpg',
    [
      'https://i.pinimg.com/1200x/05/42/66/05426622b672a5271cdfcd4813595269.jpg',
      'https://i.pinimg.com/1200x/ba/ea/88/baea88db56d4ee70ac25ef7ebe6b4bfa.jpg',
      'https://i.pinimg.com/1200x/48/ee/44/48ee440c6712e07c385f64752e866ae9.jpg',
      'https://i.pinimg.com/1200x/2a/6d/e8/2a6de8b2b6a20546d876e41872a8120d.jpg',
      'https://i.pinimg.com/1200x/79/59/76/795976cd1ec7cfce7cd0baff0cc0e8d5.jpg',
      'https://i.pinimg.com/736x/67/53/d4/6753d4546e18a5b6e121879b4e45a5f5.jpg',
      'https://i.pinimg.com/736x/c7/92/25/c7922574476f525938331938daf277f7.jpg',
      'https://i.pinimg.com/736x/6f/04/f7/6f04f7f22120c572e80a8d903f0f2baf.jpg',
      'https://i.pinimg.com/736x/72/3a/68/723a6849cd6b74d8aa9b1282cfceb7c9.jpg'
    ]
  ],
  ['highlights-loira', 'coloracao', 'Highlights Loira', 'Luzes Loiras',
    'Luzes suaves que adicionam dimensão e brilho ao cabelo loiro. Ex.: 8.1/9.1 (acinzentado) ou 8.3/9.3 (dourado).',
    'https://i.pinimg.com/1200x/6f/04/f7/6f04f7f22120c572e80a8d903f0f2baf.jpg',
    [
      'https://i.pinimg.com/1200x/6f/04/f7/6f04f7f22120c572e80a8d903f0f2baf.jpg',
      'https://i.pinimg.com/736x/be/54/1b/be541bc6bb2d9f143c119d52059c66cf.jpg',
      'https://i.pinimg.com/736x/1c/47/4d/1c474dc342e307953abf1eccd45328b1.jpg',
      'https://i.pinimg.com/736x/25/41/59/2541596666a5f2094ff755f0bf14d08d.jpg',
      'https://i.pinimg.com/1200x/b7/9a/bd/b79abd9da6b665d43b474d3844e72d07.jpg',
      'https://i.pinimg.com/1200x/60/15/22/601522009cf3871b56174b99341f5a08.jpg',
      'https://i.pinimg.com/736x/3d/11/34/3d11348cc83f29fbc5fb10873f8d104e.jpg',
      'https://i.pinimg.com/1200x/07/4e/ea/074eeae2442517936b7e83335b0c31fb.jpg',
      'https://i.pinimg.com/736x/35/a4/d1/35a4d1f4457d1905d4d3b9d868bbf799.jpg',
      'https://i.pinimg.com/736x/c5/2b/92/c52b9243137efa0fce9887e9b4511028.jpg'
    ]
  ],
  ['cherry-cola', 'coloracao', 'Cherry Cola', 'Vermelho Cereja',
    'Tom ruivo intenso com nuances de cereja e cola. Vibrante. Ex.: 4.6/5.6 ou 5.62 + 6.45 (vermelho-marrom).',
    'https://i.pinimg.com/736x/72/3a/68/723a6849cd6b74d8aa9b1282cfceb7c9.jpg',
    [
      'https://i.pinimg.com/736x/d8/23/26/d823267f6084eb8dbea4746f9e460be2.jpg',
      'https://i.pinimg.com/736x/90/60/51/906051584632065dce1b7fca1ece5763.jpg',
      'https://i.pinimg.com/736x/42/23/86/422386d026423c26b09624fc191d1a43.jpg',
      'https://i.pinimg.com/736x/ca/dd/74/cadd749ab1eb1eb434ad2c417c93fa12.jpg',
      'https://i.pinimg.com/736x/cb/57/8f/cb578f4ee3dad6b6f4f3714c7952eecf.jpg',
      'https://i.pinimg.com/1200x/e4/ae/db/e4aedb6d2ff17f4f37c5e6654320c9d3.jpg',
      'https://i.pinimg.com/736x/51/40/ab/5140ab3fd997617fb2595e442c7a224e.jpg',
      'https://i.pinimg.com/736x/e0/21/59/e0215937161205cc83f21d465a5cf4b0.jpg',
      'https://i.pinimg.com/1200x/a4/a1/00/a4a100b913c4ab16ae79a9b79a6c05c8.jpg',
      'https://i.pinimg.com/736x/f2/09/5b/f2095b75d4f28a90b51e0b954094eab5.jpg'
    ]
  ],
  ['cowgirl-copper', 'coloracao', 'Cowgirl Copper', 'Cobre Western',
    'Tom cobre intenso com inspiração western. Moderno e ousado. Ex.: 6.4/7.4 ou 7.43 + 6.45 (cobre).',
    'https://i.pinimg.com/1200x/7a/d4/f4/7ad4f49a2f9604293e2bc16d65a6d30f.jpg',
    [
      'https://i.pinimg.com/1200x/7a/d4/f4/7ad4f49a2f9604293e2bc16d65a6d30f.jpg',
      'https://i.pinimg.com/736x/39/11/3b/39113b115f5d033e0bd7a1e57a5edb74.jpg',
      'https://i.pinimg.com/736x/9c/aa/f0/9caaf070bac7c0b853e549a47cc288b5.jpg',
      'https://i.pinimg.com/736x/90/2f/8d/902f8dda8998aabe79bbb1efa6a96cfa.jpg',
      'https://i.pinimg.com/1200x/96/d2/e0/96d2e00dd6756da11140d8eb10327ae5.jpg',
      'https://i.pinimg.com/1200x/61/53/9d/61539dda3ba5eb0844362b440f7904e3.jpg',
      'https://i.pinimg.com/736x/7f/2f/16/7f2f16fe8a47abab83bc2d05914a73d2.jpg',
      'https://i.pinimg.com/1200x/3b/0e/82/3b0e827b274418c8d1013c497fa8db7a.jpg',
      'https://i.pinimg.com/736x/01/f6/b8/01f6b8f1aa7b90c91f5262f11d01d552.jpg',
      'https://i.pinimg.com/736x/c0/f0/cd/c0f0cd5ace640f47763a8f7712796ef1.jpg'
    ]
  ],
  ['ruivo-doce-leite', 'coloracao', 'Ruivo Doce de Leite', 'Ruivo Caramelo',
    'Tom ruivo com nuances carameladas e suaves. Sofisticado. Ex.: 7.4/8.34 ou 7.43 + 8.3 (caramelo).',
    'https://i.pinimg.com/736x/8a/7c/d4/8a7cd4c0523d1384c8ac71d6b97b1541.jpg',
    [
      'https://i.pinimg.com/736x/8a/7c/d4/8a7cd4c0523d1384c8ac71d6b97b1541.jpg',
      'https://i.pinimg.com/736x/25/ed/9d/25ed9dab8e2bb53ac9a17b4085e16ab2.jpg',
      'https://i.pinimg.com/736x/a0/b7/97/a0b79786127d2d317058cfff431c0e8e.jpg',
      'https://i.pinimg.com/736x/ef/d6/14/efd614f3111a48956b8731dab0d18169.jpg',
      'https://i.pinimg.com/736x/44/d1/a2/44d1a2eb76969eaaa4a5ac30a8bed2ac.jpg',
      'https://i.pinimg.com/1200x/64/a5/10/64a510801be33070b4d1a6480c5a3ca7.jpg',
      'https://i.pinimg.com/736x/92/06/03/9206038d8d76ffb5d3a52fe2a1787aca.jpg',
      'https://i.pinimg.com/1200x/62/8d/13/628d137b66de5eeea50c8f46c07eeab6.jpg',
      'https://i.pinimg.com/736x/3a/68/1f/3a681fbf103a1823a66d9e8264b13c7b.jpg',
      'https://i.pinimg.com/736x/35/14/e7/3514e79edee91c65c433bcaa322d2500.jpg'
    ]
  ],
  ['grisalhos-frios', 'coloracao', 'Grisalhos Frios', 'Cinza Prateado',
    'Transição natural com tons de cinza prateado. Sofisticação. Ex.: 7.1/8.1 ou 8.11 + 9.1 (acinzentado).',
    'https://i.pinimg.com/1200x/0f/8b/f7/0f8bf776c83fa00d99150792aac564fd.jpg',
    [
      'https://i.pinimg.com/1200x/50/4e/3e/504e3eb7e864269f264fab931c66029d.jpg',
      'https://i.pinimg.com/1200x/9f/b2/70/9fb270e7b385a9fc5ce8c3b449c8e125.jpg',
      'https://i.pinimg.com/1200x/90/22/62/9022623353025ec025251d0fca6ae41a.jpg',
      'https://i.pinimg.com/1200x/86/e9/87/86e987efda0248a60149c561cb47ec1d.jpg',
      'https://i.pinimg.com/1200x/ba/a4/80/baa480a80f64dfa597894d29a2c63d8a.jpg',
      'https://i.pinimg.com/1200x/ee/d2/f0/eed2f0d89a9d79860a74a53219b7208e.jpg',
      'https://i.pinimg.com/736x/6d/6f/47/6d6f4795dff5a4328a9665ccdf948cea.jpg',
      'https://i.pinimg.com/736x/8b/c4/cf/8bc4cf25a5cefd0d876ebf26ab8ff437.jpg',
      'https://i.pinimg.com/1200x/e0/6c/98/e06c98514f281f052efb213b8ad4e994.jpg',
      'https://i.pinimg.com/736x/34/dd/25/34dd2553acc5f670fa634dac1fbc6948.jpg'
    ]
  ],
  ['grisalhos-quentes', 'coloracao', 'Grisalhos Quentes', 'Cinza Avermelhado',
    'Transição com tons de cinza mais quentes e acinzentados. Ex.: 7.13/8.13 ou 8.3 + 8.1 (cinza quente).',
    'https://i.pinimg.com/736x/1e/aa/75/1eaa7549f9babe98cf52aee19771aa68.jpg',
    [
      'https://i.pinimg.com/736x/1e/aa/75/1eaa7549f9babe98cf52aee19771aa68.jpg',
      'https://i.pinimg.com/1200x/41/63/44/41634453f9941572a5af4e64a9c74792.jpg',
      'https://i.pinimg.com/1200x/4c/40/15/4c401595bc0d22513d8815de3769e552.jpg',
      'https://i.pinimg.com/736x/2b/4f/f3/2b4ff3062a00017b02e6d4036055bbb1.jpg',
      'https://i.pinimg.com/736x/b1/c0/d1/b1c0d1d8acbfe44d122616037e8791a2.jpg',
      'https://i.pinimg.com/1200x/3d/d9/33/3dd933def0a87a05ca2a4730c199200f.jpg',
      'https://i.pinimg.com/736x/28/c5/81/28c581dbf7f0aed7e3e8889878933259.jpg',
      'https://i.pinimg.com/1200x/d7/78/d3/d778d362ee47fa806a65b8313d384acb.jpg',
      'https://i.pinimg.com/1200x/ea/8d/fc/ea8dfc3a7df1272ab467602d5d9b1103.jpg',
      'https://i.pinimg.com/1200x/96/c8/41/96c841cc2444b3b648ba1d25f2ba5742.jpg'
    ]
  ],
  ['mocha-mousse', 'coloracao', 'Mocha Mousse', 'Marrom Café',
    'Marrom intenso com nuances suaves que lembram o café com leite. Ex.: 5.0/6.0 ou 6.7 + 5.3 (bege-marrom).',
    'https://i.pinimg.com/1200x/2b/aa/ea/2baaea4f4dc0674819552e1a00063c01.jpg',
    [
      'https://i.pinimg.com/736x/9b/15/b9/9b15b9e256a6114b5148bee2650c1364.jpg',
      'https://i.pinimg.com/1200x/d3/2d/74/d32d74825bfa044d8bb2251ccc5357a4.jpg',
      'https://i.pinimg.com/1200x/e9/c4/f9/e9c4f9b7f739f33ef4841e5e28aaed25.jpg',
      'https://i.pinimg.com/1200x/95/31/cf/9531cfe923ccfc3b4ec2bb62483a9a8c.jpg',
      'https://i.pinimg.com/1200x/34/62/e0/3462e0f503447a59bf41c070ca5d5444.jpg',
      'https://i.pinimg.com/736x/a5/ff/51/a5ff5141709b98ed5ce4b5d1c9ae0bd0.jpg',
      'https://i.pinimg.com/736x/2d/3e/a1/2d3ea1d0d754f7682d492a54f2f50531.jpg',
      'https://i.pinimg.com/736x/ee/44/b9/ee44b9e37f5ddb9c097d777ee5f14e45.jpg',
      'https://i.pinimg.com/1200x/67/11/fb/6711fba091577ed47ccefa55989e16b9.jpg',
      'https://i.pinimg.com/1200x/6e/d4/f1/6ed4f1cd71a34cc7c9964ac0f6cd24ea.jpg'
    ]
  ],
  ['expensive-brunette', 'coloracao', 'Expensive Brunette', 'Morena Premium',
    'Morena com reflexos estratégicos que criam um visual caro e sofisticado. Ex.: base 4.0/5.0 + reflexos 6.3/7.3.',
    'https://i.pinimg.com/736x/9b/15/b9/9b15b9e256a6114b5148bee2650c1364.jpg',
    [
      'https://i.pinimg.com/1200x/3e/b2/3d/3eb23d9fc16593ff95825fe42012d267.jpg',
      'https://i.pinimg.com/736x/8f/6b/78/8f6b789b5615427c79df5610a0049d89.jpg',
      'https://i.pinimg.com/1200x/be/c8/00/bec8003024f2f36eac5a7bbf2aa8eba1.jpg',
      'https://i.pinimg.com/736x/9e/61/5e/9e615e0f0ea8a9c610df0d0e4873694f.jpg',
      'https://i.pinimg.com/736x/b1/e0/71/b1e071fe7054b435341a25f422635d6f.jpg',
      'https://i.pinimg.com/736x/e9/2a/ba/e92abaeee99bbc8cfd8fe2820ccd5a57.jpg',
      'https://i.pinimg.com/1200x/a9/1d/0e/a91d0e7df9dd09eca66a0ef976d70c5b.jpg',
      'https://i.pinimg.com/736x/08/02/64/080264d0c040d46b1481762780120b95.jpg',
      'https://i.pinimg.com/736x/37/b6/c9/37b6c9c11eba90179150f789c458d5e3.jpg',
      'https://i.pinimg.com/1200x/67/11/fb/6711fba091577ed47ccefa55989e16b9.jpg'
    ]
  ],
  ['vanilla-blonde', 'coloracao', 'Vanilla Blonde', 'Loira Baunilha',
    'Loira suave e cremosa com tons de baunilha e caramelo. Exemplos aproximados: 9.7 / 9.3 ou mistura 8.3 + 9.0 (oxidante 10 vol).',
    'https://i.pinimg.com/736x/0f/d3/d1/0fd3d1b4918ed11c72d2fca3e8c8a8a7.jpg',
    [
      'https://i.pinimg.com/736x/36/2e/76/362e768aeb7ed3f16afb82c85bf8bb7e.jpg',
      'https://i.pinimg.com/736x/e8/31/c4/e831c4a68d507a47952ab3ab3349209f.jpg',
      'https://i.pinimg.com/736x/b7/15/82/b71582e483db5ee57b2dee5002605dd5.jpg',
      'https://i.pinimg.com/736x/53/a9/a9/53a9a9f6cae1b2cfbc439e44cba9b312.jpg',
      'https://i.pinimg.com/736x/35/db/af/35dbafa03c10942692ed5e38f9131229.jpg',
      'https://i.pinimg.com/736x/00/42/c9/0042c9ecd8f745f76c58d1b85f9ed36e.jpg',
      'https://i.pinimg.com/1200x/99/2d/e5/992de584e0b0e2749797baf37280f536.jpg',
      'https://i.pinimg.com/1200x/5f/ce/53/5fce536489e8c7241f02770ebb3634b4.jpg',
      'https://i.pinimg.com/736x/81/4c/4d/814c4d34d64919cea3bdfd878c5250e5.jpg',
      'https://i.pinimg.com/1200x/27/dc/08/27dc0830061a5ab30fb7e4fa82b6b5a3.jpg'
    ]
  ],
  // ===== NOVAS COLORAÇÕES (5) =====
  ['blond-de-provence', 'coloracao', 'Blond de Provence', 'Loiro Dourado Provençal',
    'Loiro dourado com nuances quentes inspirado na luz da Provença. Natural, luminoso e sofisticado. Ex.: base 7.0/8.0 + mechas 9.3/10.3 (dourado) + gloss 9.0.',
    'https://i.pinimg.com/736x/5a/74/d5/5a74d546fc0b084124a730c7307d57c0.jpg',
    [
      'https://i.pinimg.com/1200x/07/4e/ea/074eeae2442517936b7e83335b0c31fb.jpg',
      'https://i.pinimg.com/736x/53/a9/a9/53a9a9f6cae1b2cfbc439e44cba9b312.jpg',
      'https://i.pinimg.com/736x/d6/bf/d1/d6bfd17338aebccece8b27920eb062d4.jpg',
      'https://i.pinimg.com/1200x/23/e0/58/23e0584959e272e356bd429280fe1c48.jpg',
      'https://i.pinimg.com/1200x/2a/52/a5/2a52a5b54527deebdb8382b12e7e243a.jpg',
      'https://i.pinimg.com/736x/be/50/d5/be50d515a1d8487a39e9f8e5328a92e7.jpg',
      'https://i.pinimg.com/736x/e9/a1/b6/e9a1b63fd1b5cfc6b03979a9673ef7aa.jpg',
      'https://i.pinimg.com/736x/2f/89/fc/2f89fc2679984437e027bb8058c2d7f3.jpg',
      'https://i.pinimg.com/1200x/57/31/b5/5731b56a9361a4b27be2645e83f4677c.jpg',
      'https://i.pinimg.com/736x/b7/15/82/b71582e483db5ee57b2dee5002605dd5.jpg'
    ]
  ],
  ['castanho-veneza', 'coloracao', 'Castanho Veneza', 'Castanho Profundo com Reflexos Quentes',
    'Castanho profundo com reflexos quentes inspirado na tradição veneziana. Envolvente e elegante. Ex.: base 4.0/5.0 + reflexos 5.3/6.3 (dourado quente).',
    'https://i.pinimg.com/1200x/d6/03/48/d6034885db6c8ed5ec5d84f05db7033c.jpg',
    [
      'https://i.pinimg.com/1200x/3c/f5/34/3cf53462c0d6e87f978248ebe70f3fe6.jpg',
      'https://i.pinimg.com/1200x/4f/40/02/4f4002c4d5a249913c4e88a6739d1d55.jpg',
      'https://i.pinimg.com/1200x/30/02/94/300294ca9997d7c729a54f29124b3c30.jpg',
      'https://i.pinimg.com/1200x/05/5f/7b/055f7b790631c43cf0bf940dcf7036d6.jpg',
      'https://i.pinimg.com/1200x/75/06/aa/7506aa8b638a36cf60f1eea3cc0baf01.jpg',
      'https://i.pinimg.com/1200x/66/33/b3/6633b3d5f27363ed895a7cb870e20c78.jpg',
      'https://i.pinimg.com/1200x/e4/4b/da/e44bdac8a5105bfec972ba9a543bfeec.jpg',
      'https://i.pinimg.com/1200x/8f/ff/12/8fff129903ffcc7194c50e7aa30f9fed.jpg',
      'https://i.pinimg.com/736x/3b/9e/64/3b9e64e1cc395fc4d2c7865026532c61.jpg',
      'https://i.pinimg.com/736x/37/b6/c9/37b6c9c11eba90179150f789c458d5e3.jpg'
    ]
  ],
  ['morena-iluminada-carioca', 'coloracao', 'Morena Iluminada Carioca', 'Castanho com Mechas Tropicais',
    'Castanho com mechas iluminadas que capturam a luz do sol carioca. Vibrante, natural e cheio de movimento. Ex.: base 5.0/6.0 + mechas 8.3/9.3 (dourado) + babylights 7.3.',
    'https://i.pinimg.com/1200x/e8/cc/fd/e8ccfd0d23c0a67cdec7b3518588c87a.jpg',
    [
      'https://i.pinimg.com/1200x/46/9d/b3/469db33b0463950876ea5d975da0e566.jpg',
      'https://i.pinimg.com/736x/a3/4f/21/a34f2174f0d2482713d493ed5b60dcb1.jpg',
      'https://i.pinimg.com/736x/fd/e0/da/fde0da86fc5da14fec4f27dc72bbe12a.jpg',
      'https://i.pinimg.com/1200x/b1/9b/b2/b19bb26b3d54810549976ecd9970adc4.jpg',
      'https://i.pinimg.com/736x/88/0e/ae/880eae766ddf0e83527343e5ca4b7b41.jpg',
      'https://i.pinimg.com/1200x/1a/e0/dd/1ae0ddbec42dc22ef8ef25524f799de5.jpg',
      'https://i.pinimg.com/736x/3a/15/8c/3a158c4e8fe184921a993b782c4f63b8.jpg',
      'https://i.pinimg.com/1200x/f9/3e/92/f93e920afa190e3376f9591b7dce8877.jpg',
      'https://i.pinimg.com/736x/42/1f/3a/421f3a148a6a37513c9fa04c5ed3b1dc.jpg',
      'https://i.pinimg.com/736x/52/21/f8/5221f8901b131e40fa5a6f5ae7d0e8ea.jpg'
    ]
  ],
  ['brunette-romantique', 'coloracao', 'Brunette Romantique', 'Castanho com Nuances Suaves',
    'Castanho com nuances suaves e românticas inspirado no estilo francês. Delicado e atemporal. Ex.: base 5.0/6.0 + reflexos 6.7/7.7 (bege) ou 6.3/7.3 (dourado suave).',
    'https://i.pinimg.com/1200x/48/ee/44/48ee440c6712e07c385f64752e866ae9.jpg',
    [
      'https://i.pinimg.com/1200x/5e/2b/f0/5e2bf098d9eca6e2b22a34e19fda4ae9.jpg',
      'https://i.pinimg.com/736x/0a/5e/12/0a5e12f20ca2415b8fddbd1f5583b391.jpg',
      'https://i.pinimg.com/736x/9a/6e/27/9a6e279af8b3895e161b38107d50ab8e.jpg',
      'https://i.pinimg.com/736x/c9/3f/9d/c93f9d9610909597859d5aefda31f151.jpg',
      'https://i.pinimg.com/736x/ad/a1/46/ada146678d7950cc55fe4ad4f01cbd15.jpg',
      'https://i.pinimg.com/1200x/57/b9/90/57b99020f9f86cd96d54316f31db2103.jpg',
      'https://i.pinimg.com/1200x/61/6d/45/616d45b91da4964e7e022f58d7a0eb44.jpg',
      'https://i.pinimg.com/1200x/b7/8a/b6/b78ab6932e183d7e89fbe62ede38fec6.jpg',
      'https://i.pinimg.com/736x/c3/7c/04/c37c04c8558653e9e0168e13f1a8e1f8.jpg',
      'https://i.pinimg.com/1200x/0b/15/fa/0b15fa533f2633f86402eb94a9a399d7.jpg'
    ]
  ],
  ['rosso-romano', 'coloracao', 'Rosso Romano', 'Ruivo Intenso com Alma Romana',
    'Ruivo intenso com alma romana. Vibrante, profundo e cheio de personalidade. Ex.: 5.6/6.6 ou 6.45 + 5.62 (vermelho-marrom intenso).',
    'https://i.pinimg.com/736x/0d/d4/74/0dd474599a2c97cc033d4b286d328fd2.jpg',
    [
      'https://i.pinimg.com/1200x/3f/75/5d/3f755dd2ec59ecb93a8ac5c7291ab6f3.jpg',
      'https://i.pinimg.com/1200x/e1/d2/e3/e1d2e36c54a43e474203e56775aa20a0.jpg',
      'https://i.pinimg.com/1200x/6f/07/ba/6f07ba70513bad2e3c3135c2ae8b93cc.jpg',
      'https://i.pinimg.com/736x/bb/fd/9a/bbfd9afc2f271f460e5df2cc191d9fc5.jpg',
      'https://i.pinimg.com/736x/86/0e/ad/860eadf20054a131cd5b86ad32ad748b.jpg',
      'https://i.pinimg.com/1200x/0f/59/78/0f59782ab7878db0205a4950b0baac05.jpg',
      'https://i.pinimg.com/736x/e8/54/44/e85444adb13ee125ac8e115e5107e379.jpg',
      'https://i.pinimg.com/1200x/c9/34/8c/c9348c0e3ae914e596c52a8ba5977f8f.jpg',
      'https://i.pinimg.com/736x/b3/cc/22/b3cc2294403e9110b15f21ab51480cb0.jpg',
      'https://i.pinimg.com/1200x/fe/82/eb/fe82ebac89f09eecaaa255ed2b426376.jpg'
    ]
  ]
];

// ============================================================
// DADOS: PRODUTOS (15 itens)
// ============================================================
var produtosData = [
  ['kerastase-resistance-shampoo', 'produto', 'Kérastase Resistance Shampoo',
    'Força e Reconstrução',
    'Shampoo fortalecedor da linha Resistance, com Tecnologia Fibra-Kératine. Reconstrói a fibra capilar danificada, reduzindo a quebra e devolvendo resistência e elasticidade aos fios.',
    'https://i.pinimg.com/1200x/82/3a/72/823a7254a510ec701bcee0e480ba8315.jpg',
    [
      'https://i.pinimg.com/736x/78/c0/a0/78c0a0db1783a7951c45cf16793df640.jpg',
      'https://i.pinimg.com/1200x/82/3a/72/823a7254a510ec701bcee0e480ba8315.jpg',
      'https://i.pinimg.com/1200x/88/0c/ad/880cadbbbe402961bb3bc96bb3b5ca54.jpg'
    ]
  ],
  ['kerastase-resistance-conditioner', 'produto', 'Kérastase Resistance Conditioner',
    'Reconstrução Diária',
    'Condicionador da linha Resistance que nutre e reconstrói a fibra capilar. Deixa os fios mais fortes, macios e com brilho intenso, ideal para cabelos danificados.',
    'https://i.pinimg.com/736x/fa/45/3b/fa453bcb817656633d0c07edf6aa8050.jpg',
    [
      'https://i.pinimg.com/736x/cb/3a/6a/cb3a6a212e772729875a40bf24d531f8.jpg',
      'https://i.pinimg.com/736x/24/0e/b1/240eb125b9e37fe19a69d67fe456df27.jpg',
      'https://i.pinimg.com/736x/ab/d4/6f/abd46fc8a83389a59dd9b55eb16037f9.jpg'
    ]
  ],
  ['kerastase-resistance-mask', 'produto', 'Kérastase Resistance Mask',
    'Reconstrução Profunda',
    'Máscara de tratamento intensivo da linha Resistance. Com ação profunda, reconstrói a fibra capilar danificada por processos químicos e térmicos, devolvendo força e vitalidade.',
    'https://i.pinimg.com/736x/8d/eb/c3/8debc3b7fb7a7e165e3870776c00c7e6.jpg',
    [
      'https://i.pinimg.com/1200x/13/c3/75/13c37585028872dc32a4297eee127e6e.jpg',
      'https://i.pinimg.com/736x/a0/2e/cf/a02ecf93acaae6f8bf0aa5d91d0ffa71.jpg',
      'https://i.pinimg.com/736x/3a/64/48/3a6448de3f6a44a84b7cab17c7a11071.jpg'
    ]
  ],
  ['kerastase-chronologiste-oil', 'produto', 'Kérastase Chronologiste Oil',
    'Óleo Regenerador',
    'Óleo capilar regenerador com tecnologia Quantum. Nutre, repara e protege os fios, proporcionando brilho extremo e maciez. Ideal para cabelos danificados e ressecados.',
    'https://i.pinimg.com/1200x/59/d8/dd/59d8dd9ea4a78fdeb7e0b420ffcdda0a.jpg',
    [
      'https://i.pinimg.com/736x/59/c0/57/59c0570e163d499dc010ccd33581ce6d.jpg',
      'https://i.pinimg.com/736x/51/d7/7d/51d77d1ba30e0bd6e67cb598001aadbd.jpg',
      'https://i.pinimg.com/736x/e5/63/30/e56330b7327b151f6085b8daa5aa6a8e.jpg'
    ]
  ],
  ['kerastase-thermique', 'produto', 'Kérastase Resistance Thermique',
    'Protetor Térmico',
    'Protetor térmico da linha Resistance que prepara os fios para secagem e modelagem. Protege até 230°C, evitando danos causados pelo calor e preservando a saúde capilar.',
    'https://i.pinimg.com/736x/f6/62/3d/f6623df560fe941b4fce33574488031c.jpg',
    [
      'https://i.pinimg.com/736x/a4/3d/4e/a43d4e01816a1ac5f01f449c1e4ddf5e.jpg',
      'https://i.pinimg.com/736x/b4/8d/97/b48d9783d0ab18919321f36e1386c0bc.jpg',
      'https://i.pinimg.com/1200x/5f/fd/db/5ffddb136e62711a585f1c040fe847ad.jpg'
    ]
  ],
  ['joico-moisture-shampoo', 'produto', 'Joico Moisture Shampoo',
    'Hidratação Intensa',
    'Shampoo hidratante da linha Moisture Recovery com tecnologia Bio-Advanced Peptide Complex. Restaura a umidade dos cabelos secos e danificados, devolvendo maciez e brilho.',
    'https://i.pinimg.com/736x/76/24/51/7624516be549ec68f4b74a9d481fe8c2.jpg',
    [
      'https://i.pinimg.com/736x/aa/91/ef/aa91ef7f58d2efed392dea3444690a5d.jpg',
      'https://i.pinimg.com/1200x/e3/93/4c/e3934c0c465aa33ef0c295d9fb6e5e65.jpg',
      'https://i.pinimg.com/736x/76/24/51/7624516be549ec68f4b74a9d481fe8c2.jpg'
    ]
  ],
  ['joico-moisture-conditioner', 'produto', 'Joico Moisture Conditioner',
    'Nutrição e Maciez',
    'Condicionador da linha Moisture Recovery que nutre e desembaraça os fios. Proporciona hidratação profunda, maciez e proteção contra agressores externos.',
    'https://i.pinimg.com/1200x/d6/b4/fc/d6b4fc118f3fdfa53cb3a9e842a4da52.jpg',
    [
      'https://i.pinimg.com/736x/21/23/3f/21233f6f00420dfd920ff5deda8f32f1.jpg',
      'https://i.pinimg.com/736x/ec/b3/8b/ecb38bd4b30677f9ec9b63fb3b274c6e.jpg',
      'https://i.pinimg.com/736x/7b/f8/b2/7bf8b2cb9df40798577467ce0953004f.jpg'
    ]
  ],
  ['joico-moisture-mask', 'produto', 'Joico Moisture Mask',
    'Hidratação Profunda',
    'Máscara de hidratação intensiva da linha Moisture Recovery. Repõe a umidade perdida, recupera a elasticidade e devolve o brilho a cabelos secos e danificados.',
    'https://i.pinimg.com/1200x/6d/38/3b/6d383b8f18eae583c30adb655611d86d.jpg',
    [
      'https://i.pinimg.com/1200x/45/cc/98/45cc98b8de46cd2c214dde346fd16ed1.jpg',
      'https://i.pinimg.com/736x/2b/b8/31/2bb831c5fd89a70851841665fae8b96b.jpg',
      'https://i.pinimg.com/1200x/ff/d2/b9/ffd2b9808ccc298af28afb560b59c9ad.jpg'
    ]
  ],
  ['joico-color-endure', 'produto', 'Joico Color Endure Shampoo',
    'Proteção de Cor',
    'Shampoo da linha Color Endure que protege a cor e intensifica o brilho. Com Tecnologia Peptide Complex, prolonga a durabilidade da coloração e mantém os fios saudáveis.',
    'https://i.pinimg.com/1200x/7b/72/ce/7b72ce51623ca5386e74a59598dc9de3.jpg',
    [
      'https://i.pinimg.com/1200x/0c/26/86/0c26865afb8790fd2e02a2714cb5e683.jpg',
      'https://i.pinimg.com/1200x/c8/01/3f/c8013fa8af539f27af838956ccd3effe.jpg',
      'https://i.pinimg.com/736x/18/6e/5a/186e5aab3bba985de96fe34acca5d2ea.jpg'
    ]
  ],
  ['joico-defy-damage', 'produto', 'Joico Defy Damage Shampoo',
    'Defesa Antidano',
    'Shampoo da linha Defy Damage com Tecnologia Smart Release. Protege contra danos diários, poluição e calor, fortalecendo a fibra capilar e prevenindo a quebra e o ressecamento.',
    'https://i.pinimg.com/1200x/47/dd/21/47dd2172feacdaee8088c8119187edf3.jpg',
    [
      'https://i.pinimg.com/736x/7f/b9/b8/7fb9b8eae64870529b3c85c71e352f42.jpg',
      'https://i.pinimg.com/1200x/22/10/a0/2210a03151a42c9cb2b1623d4feef886.jpg',
      'https://i.pinimg.com/736x/24/35/1d/24351d93b8f043103eac576654cb5344.jpg'
    ]
  ],
  ['expert-absolut-repair-shampoo', 'produto', 'Expert Absolut Repair Shampoo',
    'Reconstrução',
    'Shampoo da linha Absolut Repair com Tecnologia Lipid-Repair. Reconstrói cabelos quimicamente danificados, devolvendo força, maciez e brilho intenso.',
    'https://i.pinimg.com/1200x/b2/69/d0/b269d04d3de7148082db4c45c179f2e6.jpg',
    [
      'https://i.pinimg.com/736x/be/1f/d5/be1fd51303ae794b19534394da3a861a.jpg',
      'https://i.pinimg.com/736x/89/6b/1c/896b1c1390819bb687feee9ad8ae7297.jpg',
      'https://i.pinimg.com/736x/82/a2/c8/82a2c82c0b93bf4eebacac702dfb3b6e.jpg'
    ]
  ],
  ['expert-absolut-repair-conditioner', 'produto', 'Expert Absolut Repair Conditioner',
    'Reconstrução Diária',
    'Condicionador da linha Absolut Repair que reconstrói a fibra capilar profundamente. Desembaraça, nutre e fortalece os fios danificados por processos químicos.',
    'https://i.pinimg.com/1200x/f7/0d/00/f70d00dddda6b8019e9fb55d0d92c63d.jpg',
    [
      'https://i.pinimg.com/736x/ac/e6/94/ace69459b5f955c0fefd0b873fe43f14.jpg',
      'https://i.pinimg.com/736x/82/5f/da/825fda428e6be4547421a812c0dabdea.jpg',
      'https://i.pinimg.com/736x/f6/2e/e0/f62ee03b99af4d0b7576e2ae45ba7633.jpg'
    ]
  ],
  ['expert-absolut-repair-mask', 'produto', 'Expert Absolut Repair Mask',
    'Reconstrução Profunda',
    'Máscara de reconstrução intensiva da linha Absolut Repair. Recupera a integridade da fibra capilar, devolvendo força, elasticidade e brilho a cabelos severamente danificados.',
    'https://i.pinimg.com/736x/cf/a0/80/cfa0808650dee9524e0165d430e0098e.jpg',
    [
      'https://i.pinimg.com/736x/34/59/ce/3459cebc3044e956410bb887d8a53457.jpg',
      'https://i.pinimg.com/736x/f7/c2/e3/f7c2e3d49a4f6e4af307529e5cc5932f.jpg',
      'https://i.pinimg.com/736x/6d/55/05/6d55050a72f3a6e613c062c5f1a2a047.jpg'
    ]
  ],
  ['expert-vitamino-color', 'produto', 'Expert Vitamino Color Shampoo',
    'Proteção de Cor Diária',
    'Shampoo da linha Vitamino Color com Tecnologia Neo-Pigment. Protege a cor, intensifica o brilho e mantém a vitalidade dos fios coloridos por mais tempo.',
    'https://i.pinimg.com/736x/8c/4a/25/8c4a254ff5b4a4541a900bad2089b9c2.jpg',
    [
      'https://i.pinimg.com/1200x/3c/6a/9c/3c6a9cbababc27152504ca4953e738ff.jpg',
      'https://i.pinimg.com/736x/c7/df/b2/c7dfb25b28a11dcd98eb8ec001fb95c6.jpg',
      'https://i.pinimg.com/1200x/49/13/db/4913db0aeb90eaa39af627682e595518.jpg'
    ]
  ],
  ['expert-metal-detox', 'produto', 'Expert Metal Detox',
    'Desintoxicação Capilar',
    'Tratamento pré-coloração da linha Metal Detox que remove partículas metálicas da fibra capilar. Garante coloração mais uniforme, brilhante e duradoura.',
    'https://i.pinimg.com/736x/3d/0f/ec/3d0fece6981e4f8fedac2225a2515c96.jpg',
    [
      'https://i.pinimg.com/736x/dd/fa/e3/ddfae3b1f8f559f1843aea2610ac3176.jpg',
      'https://i.pinimg.com/1200x/b8/6e/fe/b86efec2e8686d63a0ab7149e0ff6f54.jpg',
      'https://i.pinimg.com/1200x/dd/fd/86/ddfd86b022f90fb7491aea4eb55b76d3.jpg'
    ]
  ]
];

// ============================================================
// DADOS: KITS (15 itens)
// ============================================================
var kitsData = [
  ['kit-kerastase-resistance', 'kit', 'Kérastase Resistance Kit', 'Reconstrução Completa',
    'Kit completo com Shampoo, Condicionador e Máscara da linha Resistance. Reconstrução intensiva para cabelos danificados, devolvendo força, elasticidade e brilho.',
    'https://i.pinimg.com/1200x/0c/dd/f1/0cddf1a088784488cc73ffbedfa53ebf.jpg',
    [
      'https://i.pinimg.com/736x/ed/d3/f2/edd3f267f2d995ca3ddd2f4316a2ea66.jpg',
      'https://i.pinimg.com/736x/26/59/83/26598308d3e280c3e5c12172fd30e8bc.jpg',
      'https://i.pinimg.com/736x/c4/19/c5/c419c52357f3293954cb12235bb8a567.jpg'
    ]
  ],
  ['kit-kerastase-chronologiste', 'kit', 'Kérastase Chronologiste Kit', 'Regeneração e Brilho',
    'Kit com Óleo Regenerador e Protetor Térmico Chronologiste. Nutrição profunda, reparação e proteção térmica para cabelos danificados e ressecados.',
    'https://i.pinimg.com/736x/c1/4a/bb/c14abbd5fb1d4528ab1371784cd4503b.jpg',
    [
      'https://i.pinimg.com/1200x/0d/39/ae/0d39aeeb056fd43fc060a56555480565.jpg',
      'https://i.pinimg.com/736x/85/2f/4d/852f4d0951ce8b754038f12f99c8b4ed.jpg',
      'https://i.pinimg.com/1200x/81/a8/bf/81a8bf33b07433341cb8f58c305bf429.jpg'
    ]
  ],
  ['kit-kerastase-thermique', 'kit', 'Kérastase Thermique Kit', 'Proteção Térmica',
    'Kit com Protetor Térmico e Óleo Finalizador. Protege os fios contra o calor de ferramentas até 230°C e devolve brilho e maciez intensos.',
    'https://i.pinimg.com/1200x/40/7e/87/407e877f2325ceded92fd59cee423193.jpg',
    [
      'https://i.pinimg.com/1200x/c1/3e/5d/c13e5d4ba01867b5a2de1a677d09302d.jpg',
      'https://i.pinimg.com/736x/a8/b6/fd/a8b6fddb483f3e94c5fd303b373af19c.jpg',
      'https://i.pinimg.com/736x/c5/31/c6/c531c62a3624f7dde4cdc2ee8ef6d8b6.jpg'
    ]
  ],
  ['kit-kerastase-resistance-mask', 'kit', 'Kérastase Resistance Mask Kit', 'Reconstrução Profunda',
    'Kit com 2 unidades da Máscara Resistance. Tratamento intensivo que reconstrói a fibra capilar danificada por processos químicos e térmicos.',
    'https://i.pinimg.com/736x/40/b8/c2/40b8c22108d5712a18d9ecd02d5233d5.jpg',
    [
      'https://i.pinimg.com/736x/91/e6/86/91e6865f11d7e3d1d6a0677131597e2b.jpg',
      'https://i.pinimg.com/1200x/b1/9c/a6/b19ca6af05a7a9ac8fc0b1f93982c3ce.jpg',
      'https://i.pinimg.com/736x/f5/bc/0c/f5bc0c52fd5347eb388ad6a51cb6d010.jpg'
    ]
  ],
  ['kit-kerastase-hydration', 'kit', 'Kérastase Hydration Kit', 'Hidratação Essencial',
    'Kit com Shampoo, Condicionador e Máscara da linha Nutritive. Hidratação intensa para cabelos secos e ressecados, devolvendo maciez e brilho.',
    'https://i.pinimg.com/1200x/5e/59/9d/5e599d616ffdb609f55cc48a92832340.jpg',
    [
      'https://i.pinimg.com/736x/4a/a3/f4/4aa3f4b472556d5aa8e6ad2f66bd0595.jpg',
      'https://i.pinimg.com/1200x/ae/a4/60/aea460c2d74ca14511976aab025a01cf.jpg',
      'https://i.pinimg.com/236x/8f/46/30/8f463046ad92a0bc308d9c9a68e30d52.jpg'
    ]
  ],
  ['kit-joico-moisture', 'kit', 'Joico Moisture Recovery Kit', 'Hidratação Profunda',
    'Kit completo com Shampoo, Condicionador e Máscara Moisture Recovery. Hidratação intensiva com tecnologia Bio-Advanced Peptide Complex para cabelos secos e danificados.',
    'https://i.pinimg.com/1200x/55/d6/10/55d610f599b3c10b5fe4cafceb5104fc.jpg',
    [
      'https://i.pinimg.com/1200x/37/eb/38/37eb38f29a15f9f2b571ef4c72e9ae73.jpg',
      'https://i.pinimg.com/736x/67/be/08/67be084978b5c1f0fdf7170ccb071d9e.jpg',
      'https://i.pinimg.com/1200x/f0/39/f9/f039f9d99452b6304575864a8695a88b.jpg'
    ]
  ],
  ['kit-joico-color-endure', 'kit', 'Joico Color Endure Kit', 'Proteção de Cor',
    'Kit com Shampoo e Condicionador Color Endure. Protege a cor, intensifica o brilho e prolonga a durabilidade da coloração com Tecnologia Peptide Complex.',
    'https://i.pinimg.com/736x/ed/92/df/ed92dfe26b5bf8d567ffc982ec8335a9.jpg',
    [
      'https://i.pinimg.com/736x/55/f6/fb/55f6fbc94440f61acd2b29ce3a0ec87f.jpg',
      'https://i.pinimg.com/736x/81/5d/a5/815da5dd12b7f501add1182400694ef1.jpg',
      'https://i.pinimg.com/1200x/c8/45/45/c8454574dc124e61c5ff54b0fa7b4e87.jpg'
    ]
  ],
  ['kit-joico-defy-damage', 'kit', 'Joico Defy Damage Kit', 'Defesa Antidano',
    'Kit com Shampoo, Condicionador e Leave-in Defy Damage. Protege contra danos diários, poluição e calor com Tecnologia Smart Release.',
    'https://i.pinimg.com/236x/0b/92/13/0b9213aaedddaf68940bb3a89fb62dc8.jpg',
    [
      'https://i.pinimg.com/736x/36/a4/ec/36a4ec1861b63319fe1e9cdd71b533b6.jpg',
      'https://i.pinimg.com/1200x/d4/7b/cb/d47bcb80c0e571e40b7fc11b454f5059.jpg',
      'https://i.pinimg.com/736x/a5/87/83/a5878313d7f90c8a328fddb978de7d34.jpg'
    ]
  ],
  ['kit-joico-moisture-mask', 'kit', 'Joico Moisture Mask Kit', 'Hidratação Intensiva',
    'Kit com 2 unidades da Máscara Moisture Recovery. Repõe a umidade perdida, recupera a elasticidade e devolve o brilho a cabelos secos e danificados.',
    'https://i.pinimg.com/736x/ca/c4/15/cac415197ee2db5b5d7a12890b225b9a.jpg',
    [
      'https://i.pinimg.com/736x/23/cf/33/23cf33cee26dfb383d78663dfd23b864.jpg',
      'https://i.pinimg.com/736x/ec/b3/8b/ecb38bd4b30677f9ec9b63fb3b274c6e.jpg',
      'https://i.pinimg.com/736x/6d/38/3b/6d383b8f18eae583c30adb655611d86d.jpg'
    ]
  ],
  ['kit-joico-Volumizing', 'kit', 'Joico Volumizing Kit', 'Volume e Leveza',
    'Kit com Shampoo e Condicionador Volumizing. Proporciona volume, corpo e leveza aos fios, deixando o cabelo mais encorpado, solto e com movimento.',
    'https://i.pinimg.com/1200x/94/ff/44/94ff449ed215781b29fa5555920ea95a.jpg',
    [
      'https://i.pinimg.com/736x/b1/79/cd/b179cdd3c0691a77521b5246a61e4add.jpg',
      'https://i.pinimg.com/736x/1d/bc/24/1dbc2405985303d3d5456ea919dfd899.jpg',
      'https://i.pinimg.com/736x/cf/87/e8/cf87e8b258211b1ec6f288dc243adc80.jpg'
    ]
  ],
  ['kit-expert-absolut-repair', 'kit', 'Expert Absolut Repair Kit', 'Reconstrução Completa',
    'Kit completo com Shampoo, Condicionador e Máscara Absolut Repair. Reconstrução intensiva com Tecnologia Lipid-Repair para cabelos quimicamente danificados.',
    'https://i.pinimg.com/736x/5b/da/00/5bda009665f3eff9b6aa04f58e2c473f.jpg',
    [
      'https://i.pinimg.com/736x/e3/5e/2c/e35e2c9e9d5e31aac8793ea1cc1ebb19.jpg',
      'https://i.pinimg.com/736x/5c/82/2c/5c822c9dcd5ecae1bda1ee964bd8eeb1.jpg',
      'https://i.pinimg.com/736x/6d/55/05/6d55050a72f3a6e613c062c5f1a2a047.jpg'
    ]
  ],
  ['kit-expert-vitamino-color', 'kit', 'Expert Vitamino Color Kit', 'Proteção de Cor Diária',
    'Kit com Shampoo e Condicionador Vitamino Color. Protege a cor, intensifica o brilho e mantém a vitalidade dos fios coloridos com Tecnologia Neo-Pigment.',
    'https://i.pinimg.com/736x/f6/51/d6/f651d62a113c18ac4101aa31c2cec0d0.jpg',
    [
      'https://i.pinimg.com/1200x/85/4e/02/854e02ce74bf9af04d04cbf86830e14c.jpg',
      'https://i.pinimg.com/1200x/3e/ae/bb/3eaebbaa9f8e58142b50b6d713d9ce49.jpg',
      'https://i.pinimg.com/736x/38/43/23/384323902c28e3c7a44a03ae06db29b7.jpg'
    ]
  ],
  ['kit-expert-metal-detox', 'kit', 'Expert Metal Detox Kit', 'Desintoxicação Capilar',
    'Kit com Tratamento Metal Detox e Shampoo. Remove partículas metálicas da fibra capilar, garantindo coloração mais uniforme, brilhante e duradoura.',
    'https://i.pinimg.com/1200x/85/4e/02/854e02ce74bf9af04d04cbf86830e14c.jpg',
    [
      'https://i.pinimg.com/1200x/85/4e/02/854e02ce74bf9af04d04cbf86830e14c.jpg',
      'https://i.pinimg.com/736x/f7/c2/e3/f7c2e3d49a4f6e4af307529e5cc5932f.jpg',
      'https://i.pinimg.com/736x/3d/0f/ec/3d0fece6981e4f8fedac2225a2515c96.jpg'
    ]
  ],
  ['kit-expert-absolut-repair-mask', 'kit', 'Expert Absolut Repair Mask Kit', 'Reconstrução Profunda',
    'Kit com 2 unidades da Máscara Absolut Repair. Recupera a integridade da fibra capilar, devolvendo força, elasticidade e brilho a cabelos severamente danificados.',
    'https://i.pinimg.com/736x/11/51/da/1151da5401aa1ff0533a5a2e221488ab.jpg',
    [
      'https://i.pinimg.com/736x/e5/5f/83/e55f83ba1959fc476a7d340f488c3a1a.jpg',
      'https://i.pinimg.com/736x/79/9b/c9/799bc972103f05b8e50a5e4d3337c14b.jpg',
      'https://i.pinimg.com/736x/3a/43/ef/3a43efa8384793d904ed8aee02c9d172.jpg'
    ]
  ],
  ['kit-expert-serum', 'kit', 'Expert Serum Kit', 'Brilho e Maciez',
    'Kit com Sérum Finalizador e Óleo Capilar. Brilho intenso, maciez e nutrição para os fios, com proteção contra agressores externos e finalização profissional.',
    'https://i.pinimg.com/736x/19/57/93/1957934cfe15752a65f5bd14dff91a7a.jpg',
    [
      'https://i.pinimg.com/1200x/d1/94/cf/d194cf9242db006d8c2340d16c656c18.jpg',
      'https://i.pinimg.com/736x/73/70/87/737087916e22525775a637957ab6962f.jpg',
      'https://i.pinimg.com/1200x/64/3d/8d/643d8de41d7c632d14be74923199d10a.jpg'
    ]
  ]
];

// ============================================================
// DADOS: FERRAMENTAS (15 itens)
// ============================================================
var ferramentasData = [
  [
    'secador-ionico-pro',
    'ferramentas',
    'Secador Iônico Pro',
    'Secagem Rápida e Antifrizz',
    'Secador profissional com tecnologia iônica que reduz o frizz, acelera a secagem e ajuda a proporcionar um acabamento mais alinhado e brilhante. Indicado para uso profissional e diferentes tipos de cabelo.',
    'https://i.pinimg.com/736x/7f/4d/8b/7f4d8b424f29dffaa67ad8856df09263.jpg',
    [
      'https://i.pinimg.com/1200x/ef/ef/f4/efeff4b83e8aecf58644af080c24e4ac.jpg',
      'https://i.pinimg.com/736x/41/31/08/4131089e2d531379ade8f1ac547246bd.jpg',
      'https://i.pinimg.com/736x/51/d7/fe/51d7fe3f8c05b4ddfbfc1ca2e0c4e996.jpg'
    ]
  ],
  [
    'prancha-titanium',
    'ferramentas',
    'Prancha de Titânio',
    'Alisamento Uniforme',
    'Prancha profissional com placas de titânio que proporcionam alta condução de calor e distribuição uniforme da temperatura. Indicada para alisamento, modelagem e finalização de diferentes tipos de cabelo.',
    'https://i.pinimg.com/1200x/e7/b6/e1/e7b6e1de363429ccf8f85d02f6c3abbc.jpg',
    [
      'https://i.pinimg.com/736x/69/a2/4c/69a24ce045d17b1f16c50789eafc00fb.jpg',
      'https://i.pinimg.com/736x/5e/12/e6/5e12e630cc54a79d81b0e6c504eed9d5.jpg',
      'https://i.pinimg.com/1200x/21/0c/ec/210cec95d149ae3e8622ae3441d830ed.jpg'
    ]
  ],
  [
    'modelador-ondas',
    'ferramentas',
    'Modelador de Ondas',
    'Ondas Perfeitas',
    'Modelador térmico de um cilindros desenvolvido para criar ondas marcadas e regulares. O formato permite trabalhar mechas de maneira uniforme, criando efeito ondulado com acabamento definido.',
    'https://i.pinimg.com/736x/e5/5c/8d/e55c8d124b8fbd55f7a2a45f6a238dd7.jpg',
    [
      'https://i.pinimg.com/736x/2c/ee/a8/2ceea8d25dc03ce7b4961da20d619a77.jpg',
      'https://i.pinimg.com/736x/cc/b2/64/ccb2645665518c74182d633f4586b005.jpg',
      'https://i.pinimg.com/736x/14/12/e1/1412e160d106839a11b2a8cdfae2654c.jpg'
    ]
  ],
  [
    'babyliss-ceramica',
    'ferramentas',
    'Babyliss Cerâmica',
    'Cachos Definidos',
    'Modelador cilíndrico com revestimento cerâmico indicado para criar cachos e ondas com controle de temperatura. O diâmetro do cilindro influencia diretamente o tamanho e a definição do resultado.',
    'https://i.pinimg.com/736x/ff/a3/ae/ffa3ae40d17685e0321de9ca3e27a41d.jpg',
    [
      'https://i.pinimg.com/1200x/6e/b6/79/6eb6797d78cbe5606ad9d29998eb75e5.jpg',
      'https://i.pinimg.com/736x/5d/9f/97/5d9f9707aaf6d4c444e2d65da38fcd5b.jpg',
      'https://i.pinimg.com/1200x/b9/58/75/b95875d1a7945aaab782f67e382ba4ff.jpg'
    ]
  ],
  [
    'escova-rotativa',
    'ferramentas',
    'Escova Rotativa',
    'Modelagem e Volume',
    'Escova rotativa de ar quente que combina secagem e modelagem. O movimento rotativo ajuda a criar volume, movimento e acabamento alinhado durante a secagem.',
    'https://i.pinimg.com/736x/26/b8/ba/26b8ba113a222d08c5a7ececcf00cecf.jpg',
    [
      'https://i.pinimg.com/736x/73/5a/0e/735a0e7eda137b5fd090530a3f7321d0.jpg',
      'https://i.pinimg.com/736x/73/5a/0e/735a0e7eda137b5fd090530a3f7321d0.jpg',
      'https://i.pinimg.com/1200x/1d/4f/38/1d4f389fec6dfa518585926148342c42.jpg'
    ]
  ],
  [
    'tesoura-profissional',
    'ferramentas',
    'Tesoura Profissional',
    'Corte de Precisão',
    'Tesoura profissional desenvolvida para cortes técnicos e acabamento de precisão. O formato ergonômico favorece controle e estabilidade durante o trabalho do cabeleireiro.',
    'https://i.pinimg.com/736x/6b/05/1d/6b051d5086bf9f85682e686e181bcf10.jpg',
    [
      'https://i.pinimg.com/1200x/7c/2e/ea/7c2eea5dd695bd9df6ab6524387652c6.jpg',
      'https://i.pinimg.com/1200x/aa/2d/20/aa2d2071d977ea08ae16bab3ee8b8466.jpg',
      'https://i.pinimg.com/1200x/20/d4/05/20d4052d35ab73cb838683fdc18df058.jpg'
    ]
  ],
  [
    'Kit de Escova de Cerdas Naturais',
    'ferramentas',
    'Escova de Cerdas Naturais',
    'Acabamento e Brilho',
    'Escova com cerdas naturais indicada para pentear, distribuir a oleosidade natural ao longo dos fios e proporcionar um acabamento mais polido. Pode ser especialmente útil em cabelos lisos e ondulados.',
    'https://i.pinimg.com/736x/32/2f/20/322f20b363ee6487911c3817f293dd21.jpg',
    [
      'https://i.pinimg.com/736x/f0/a4/11/f0a411143156c8668bd4f6ae64e55f25.jpg',
      'https://i.pinimg.com/1200x/02/42/35/024235cc5d211b0a9e05b2e9883886e7.jpg',
      'https://i.pinimg.com/1200x/62/31/ba/6231ba96187c6edeb9cc78a99fc823de.jpg'
    ]
  ],
  [
    'maquina-corte',
    'ferramentas',
    'Máquina de Corte',
    'Degradê e Aparo',
    'Máquina profissional de corte com lâmina ajustável, indicada para cortes masculinos, contornos, aparos e construção de degradês. O controle da lâmina permite trabalhar diferentes comprimentos.',
    'https://i.pinimg.com/736x/00/2b/50/002b5062b94512b47d3916ecf55212d3.jpg',
    [
      'https://i.pinimg.com/736x/fd/46/b1/fd46b19a09a5a83e1eedd7a544be466b.jpg',
      'https://i.pinimg.com/736x/dc/f8/3e/dcf83e5930d2ff7b0af588b1f7ba1791.jpg',
      'https://i.pinimg.com/736x/be/3d/a8/be3da8c62a5a3bdd21cc5605abd23e54.jpg'
    ]
  ],
  [
    'difusor-universal',
    'ferramentas',
    'Difusor Universal',
    'Cachos sem Frizz',
    'Acessório para secador que distribui o fluxo de ar de maneira mais ampla e suave. Indicado principalmente para cabelos ondulados, cacheados e crespos, ajudando a preservar a formação natural dos cachos.',
    'https://i.pinimg.com/736x/de/d6/1f/ded61f2c199f9e13e40fd64d3aa51708.jpg',
    [
      'https://i.pinimg.com/1200x/3e/15/a6/3e15a66f16a649716a2b7c69b611062a.jpg',
      'https://i.pinimg.com/1200x/fe/97/ff/fe97ff246be6747be32d4c6af87789ce.jpg',
      'https://i.pinimg.com/736x/40/94/40/409440dabf1d219f45e92534b7da1e8d.jpg'
    ]
  ],
  [
    'escova-termica-alisadora',
    'ferramentas',
    'Escova Térmica Alisadora',
    'Alisamento e Modelagem',
    'Escova elétrica com superfície aquecida que permite alinhar e modelar os fios durante o penteado. Indicada principalmente para retoques, redução de volume e acabamento mais liso.',
    'https://i.pinimg.com/736x/fe/02/a6/fe02a6570cf649da1defec4455a46b2d.jpg',
    [
      'https://i.pinimg.com/736x/5e/c3/db/5ec3dbbf91dba4dbff59fdd7f3c57c00.jpg',
      'https://i.pinimg.com/736x/7e/72/8d/7e728d6281c3f99dec672f9cfe638375.jpg',
      'https://i.pinimg.com/736x/74/e2/a6/74e2a672b7ebe13187e0d7ec5ed2a36d.jpg'
    ]
  ],
  [
    'escova-paddle',
    'ferramentas',
    'Escova Paddle',
    'Desembaraçar e Alisar',
    'Escova de base larga e formato plano indicada para desembaraçar e alinhar cabelos médios e longos. Sua área ampla permite trabalhar grandes seções de cabelo com rapidez.',
    'https://i.pinimg.com/1200x/49/36/a0/4936a0c18a5b237312f90b674f9b45db.jpg',
    [
      'https://i.pinimg.com/1200x/5f/f6/73/5ff673fcb94edbaa319ec3da502cc7a6.jpg',
      'https://i.pinimg.com/736x/91/b1/90/91b1905d8a7c17206f3a1671d1954a05.jpg',
      'https://i.pinimg.com/736x/45/c4/4b/45c44b757a8b4a1191d7276048e597b8.jpg'
    ]
  ],
  [
    'escova-termica',
    'ferramentas',
    'Escova Térmica',
    'Modelagem com Brilho',
    'Escova redonda com cilindro cerâmico desenvolvida para uso durante a secagem. A superfície ajuda a distribuir o calor de maneira uniforme e facilita a criação de volume, movimento e acabamento polido.',
    'https://i.pinimg.com/736x/f3/b8/14/f3b8140efec0fd25bee16ede2f9effb2.jpg',
    [
      'https://i.pinimg.com/736x/80/79/77/8079773d48fc57850c5ed932e3ae69b8.jpg',
      'https://i.pinimg.com/736x/5d/47/ff/5d47ffffde26ab74dfadee1bdf9dfcd3.jpg',
      'https://i.pinimg.com/736x/8d/5b/e7/8d5be7313f6720b5cfe57b3da3523b7a.jpg'
    ]
  ],
  [
    'escova-madeira',
    'ferramentas',
    'Escova de Madeira',
    'Antiestática e Natural',
    'Escova com corpo de madeira e cerdas naturais indicada para pentear e massagear suavemente o couro cabeludo. Pode ajudar a reduzir a eletricidade estática e proporcionar um acabamento mais natural.',
    'https://i.pinimg.com/1200x/c5/8b/07/c58b07b61ad05709df43c3b92cd24e5c.jpg',
    [
      'https://i.pinimg.com/1200x/34/f1/0b/34f10b055e1b0b0d107737fa5ae04fed.jpg',
      'https://i.pinimg.com/736x/b5/0b/3b/b50b3bccf7ab2db949e26faafdbbb339.jpg',
      'https://i.pinimg.com/736x/9c/17/50/9c1750c276319824a659ce755c652be4.jpg'
    ]
  ],
  [
    'massageador-capilar',
    'ferramentas',
    'Massageador Capilar',
    'Estímulo e Relaxamento',
    'Massageador com pontas de silicone desenvolvido para massagear o couro cabeludo. Pode ser utilizado durante a higienização ou como parte de uma rotina de relaxamento e cuidados com o couro cabeludo.',
    'https://i.pinimg.com/1200x/3d/a9/f2/3da9f25d3ffb632da87d0f1fb4189250.jpg',
    [
      'https://i.pinimg.com/1200x/37/84/ad/3784ad0486d8e36d4dad6dfc1bbc646c.jpg',
      'https://i.pinimg.com/736x/2e/4b/35/2e4b353192b23a4a4314aa72693dc6ae.jpg',
      'https://i.pinimg.com/736x/4b/37/53/4b375331adfc3ab8dd94c27cfd6e5e37.jpg'
    ]
  ],
  [
    'touca-termica',
    'ferramentas',
    'Touca Térmica',
    'Potencializa Tratamentos',
    'Touca térmica utilizada durante determinados tratamentos capilares para manter o cabelo aquecido de maneira uniforme. Deve ser utilizada de acordo com as instruções do produto ou tratamento aplicado.',
    'https://i.pinimg.com/736x/e0/fd/95/e0fd9535ba1eea5eeaff20e49bfc7308.jpg',
    [
      'https://i.pinimg.com/1200x/8c/5f/e7/8c5fe75321e624f96287da2885a79201.jpg',
      'https://i.pinimg.com/736x/4f/cd/7f/4fcd7f37e266061e2d8691fb59e2e5d3.jpg',
      'https://i.pinimg.com/736x/04/79/1f/04791ffd29b9c9ceac9f42102bd01031.jpg'
    ]
  ]
];

// ============================================================
// CONSTRUINDO O OBJETO styleData GLOBAL
// ============================================================
var styleData = {};

function addItemsToStyleData(dataArray) {
  dataArray.forEach(function (item) {
    var id = item[0],
      cat = item[1],
      corte = item[2],
      title = item[3],
      desc = item[4],
      img = item[5],
      variants = item[6];
    styleData[id] = createCard(id, cat, corte, title, desc, img, variants);
  });
}

addItemsToStyleData(cortesData);
addItemsToStyleData(coloracoesData);
addItemsToStyleData(produtosData);
addItemsToStyleData(kitsData);
addItemsToStyleData(ferramentasData);
